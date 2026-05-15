import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import { useAppContext } from '../context/AppContext';
import { Message as IMessage } from '../types';
import MascotImage from '../components/MascotImage';

interface ChatMessageResponse {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
}

function formatTime(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function toDisplayMessage(m: ChatMessageResponse, kakaoId: string | null): IMessage {
  return {
    id: m.id.toString(),
    senderId: m.senderId.toString() === kakaoId ? 'me' : m.senderId.toString(),
    text: m.content,
    timestamp: formatTime(m.createdAt),
  };
}

export default function ChatPage() {
  const navigate = useNavigate();
  const { activeChat, kakaoId } = useAppContext();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState('');
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!activeChat) return;

    const partnerId = activeChat.partner.id;

    // 채팅 내역 로드
    fetch(`/api/chat/messages?partnerId=${partnerId}`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : [])
      .then((data: ChatMessageResponse[]) => {
        setMessages(data.map(m => toDisplayMessage(m, kakaoId)));
      })
      .catch(() => {});

    // WebSocket 연결
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      onConnect: () => {
        client.subscribe('/user/queue/chat', frame => {
          const msg: ChatMessageResponse = JSON.parse(frame.body);
          // 현재 열려있는 채팅 상대의 메시지만 표시
          if (
            msg.senderId.toString() === partnerId ||
            msg.receiverId.toString() === partnerId
          ) {
            setMessages(prev => [...prev, toDisplayMessage(msg, kakaoId)]);
          }
        });
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
      stompClientRef.current = null;
    };
  }, [activeChat?.partner.id, kakaoId]);

  if (!activeChat) {
    navigate('/home');
    return null;
  }

  const send = () => {
    if (!input.trim() || !stompClientRef.current?.connected) return;
    stompClientRef.current.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({ receiverId: activeChat.partner.id, content: input }),
    });
    setInput('');
  };

  return (
    <div className="h-full w-full bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center border-b border-gray-800 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-10">
        <button onClick={() => navigate('/home')} className="p-2 -ml-2 text-gray-400"><ChevronLeft /></button>
        <div className="flex items-center gap-3 ml-2">
          <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
            <MascotImage type={activeChat.partner.mascotType} className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">{activeChat.partner.nickname}</h3>
            <p className="text-[10px] text-gray-500">{activeChat.partner.department}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex justify-center">
          <span className="text-[10px] bg-white/5 text-gray-500 px-3 py-1 rounded-full border border-white/5">
            익명 대화가 시작되었습니다 (48시간 후 폭파)
          </span>
        </div>

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-[24px] px-4 py-3 text-sm ${
              m.senderId === 'me'
              ? 'bg-purple-600 text-white rounded-tr-none'
              : 'bg-[#1a1a1a] text-gray-200 rounded-tl-none border border-gray-800'
            }`}>
              {m.text}
              <div className={`text-[9px] mt-1 opacity-50 ${m.senderId === 'me' ? 'text-right' : 'text-left'}`}>
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-[#0a0a0a] border-t border-gray-800 pb-10">
        <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-[24px] px-4 py-2 border border-gray-800 focus-within:border-gray-600 transition-colors">
          <button className="text-gray-500"><Plus size={20} /></button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && send()}
            placeholder="메시지를 입력하세요"
            className="flex-1 bg-transparent border-none outline-none text-sm text-white py-2"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className={`p-2 rounded-full ${input.trim() ? 'bg-white text-black' : 'text-gray-600'}`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
