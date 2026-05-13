import { useState, useEffect } from 'react';
import { ChevronLeft, Send, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Message as IMessage } from '../types';
import MascotImage from '../components/MascotImage';

export default function ChatPage() {
  const navigate = useNavigate();
  const { activeChat } = useAppContext();
  const [input, setInput] = useState('');
  // ⚠️ Hooks는 조건문 앞에서 무조건 선언해야 한다 (Rules of Hooks)
  const [messages, setMessages] = useState<IMessage[]>([]);

  // activeChat이 세팅되면 초기 메시지 주입
  useEffect(() => {
    if (activeChat) {
      setMessages([
        { id: '1', senderId: activeChat.partner.id, text: '안녕하세요! 매칭되어서 반가워요 :)', timestamp: '오후 2:30' },
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChat?.partner.id]);

  // activeChat이 없으면 홈으로 리다이렉트
  if (!activeChat) {
    navigate('/home');
    return null;
  }

  const send = () => {
    if (!input.trim()) return;
    const newMessage: IMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      text: input,
      timestamp: '오후 2:45'
    };
    setMessages([...messages, newMessage]);
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
