import { motion } from 'motion/react';
import { ChevronLeft, Send, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import MascotImage from '../components/MascotImage';

export default function UserDetailPage() {
  const navigate = useNavigate();
  const { selectedUser } = useAppContext();

  if (!selectedUser) {
    navigate('/home');
    return null;
  }

  return (
    <div className="h-full w-full bg-[#0a0a0a] flex flex-col relative">
      {/* Hero Section */}
      <div className="h-2/5 bg-gradient-to-b from-[#1a1a2e] to-[#0a0a0a] flex items-center justify-center relative">
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 p-2 bg-black/20 backdrop-blur-md rounded-full text-white z-10">
          <ChevronLeft size={24} />
        </button>
        <button className="absolute top-6 right-6 p-2 bg-black/20 backdrop-blur-md rounded-full text-white/50 z-10">
          <ShieldAlert size={20} />
        </button>

        <MascotImage type={selectedUser.mascotType} className="w-56 h-56" />
      </div>

      <div className="flex-1 p-8 -mt-10 bg-[#0a0a0a] rounded-t-[40px] z-20 shadow-2xl shadow-black/80">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{selectedUser.nickname}</h1>
            <p className="text-purple-400 font-medium">{selectedUser.department}</p>
          </div>
          <div className="text-right">
            <span className="block text-2xl font-bold text-pink-500">{selectedUser.matchScore}%</span>
            <span className="text-xs text-gray-500">Match Score</span>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Personality Keywords</h3>
            <div className="flex flex-wrap gap-3">
              {selectedUser.keywords.map(k => (
                <span key={k} className="px-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-2xl text-sm text-gray-300">
                  #{k}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-[#1a1a1a] p-6 rounded-[32px] border border-gray-800">
            <h3 className="text-sm font-bold text-white mb-3">캐릭터 소개</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              안녕하세요! 저는 {selectedUser.nickname}입니다. 대화를 통해 천천히 알아가는 만남을 좋아해요. 축제 기간 동안 소소한 즐거움을 함께 나눌 분을 찾고 있습니다.
            </p>
          </section>
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-6 pb-12">
        <button
          onClick={() => navigate('/heartpings')}
          className="w-full h-16 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-3xl flex items-center justify-center gap-3 shadow-lg shadow-pink-500/20 active:scale-95 transition-transform"
        >
          <Send size={20} />
          <span>하트핑 보내기</span>
        </button>
      </div>
    </div>
  );
}
