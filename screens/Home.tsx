
import React from 'react';
import { UserProfile } from '../types';
import { sound } from '../services/audioService';

interface HomeProps {
  onStart: () => void;
  profile: UserProfile;
}

const Home: React.FC<HomeProps> = ({ onStart, profile }) => {
  const handleStart = () => {
    sound.playClick();
    sound.startMusic();
    onStart();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#0f172a]">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-lime-600/10 rounded-full blur-[150px] animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 max-w-4xl animate-in fade-in duration-1000">
        <div className="mb-8 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-lime-500/30 bg-lime-500/5 text-lime-400 text-[10px] font-black tracking-[0.2em] uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
          </span>
          <span>Chào mừng học viên: {profile.name} - Lớp {profile.className}</span>
        </div>
        
        <h1 className="text-6xl md:text-9xl font-black mb-6 leading-tight tracking-tighter italic">
          <span className="text-white">NEXTGEN</span><br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-[#00d4ff] uppercase">
            CODER
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Hệ thống đào tạo lập trình viên thế hệ mới. Sử dụng sức mạnh thuật toán và AI 
          để kiến tạo tương lai số của chính bạn.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <button 
            onClick={handleStart}
            className="group relative px-12 py-5 bg-white text-slate-900 rounded-[28px] text-xl font-black overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-lime-500/20"
          >
            <span className="relative z-10 flex items-center space-x-3">
              <span className="tracking-widest uppercase italic">KHỞI CHẠY</span>
              <span className="group-hover:translate-x-2 transition-transform text-2xl">→</span>
            </span>
          </button>
          
          <div className="glass px-8 py-5 rounded-[28px] flex items-center space-x-6 border-slate-700/50">
            <div className="text-left">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Cấp độ</p>
              <p className="text-2xl font-black text-[#ccff00]">Lvl {profile.level}</p>
            </div>
            <div className="w-[1px] h-10 bg-slate-800"></div>
            <div className="text-left">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Thành tích</p>
              <p className="text-2xl font-black text-sky-400">{profile.badges.length} Huy hiệu</p>
            </div>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="🤖" 
              title="Cố vấn AI" 
              desc="Hệ thống Nexus AI hỗ trợ giải đáp và gợi ý code theo thời gian thực."
            />
            <FeatureCard 
              icon="⚡" 
              title="Luyện tập nhanh" 
              desc="Kho thư viện 200+ câu hỏi trắc nghiệm giúp rèn luyện tư duy logic."
            />
            <FeatureCard 
              icon="🏆" 
              title="Bảng Vinh Danh" 
              desc="Leo hạng để trở thành Codemancer huyền thoại của lớp học."
            />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div 
    onMouseEnter={() => sound.playClick()}
    className="glass p-8 rounded-[35px] text-left hover:border-lime-500/50 transition-all group cursor-default border-slate-800/50 hover:bg-lime-500/5"
  >
    <div className="text-4xl mb-6 transform group-hover:rotate-12 transition-transform">{icon}</div>
    <h3 className="text-lg font-black mb-3 text-slate-100 uppercase italic tracking-tight">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

export default Home;
