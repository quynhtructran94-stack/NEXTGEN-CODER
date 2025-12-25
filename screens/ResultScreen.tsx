
import React, { useEffect, useState } from 'react';
import { UserProfile, Badge } from '../types';
import { RANK_BADGES } from '../constants';
import { sound } from '../services/audioService';

interface ResultScreenProps {
  profile: UserProfile;
  onRestart: () => void;
  onHome: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ profile, onRestart, onHome }) => {
  const [badge, setBadge] = useState<Badge | null>(null);
  const [status, setStatus] = useState<'won' | 'passed' | 'failed'>('failed');

  useEffect(() => {
    if (profile.xp >= 5000) {
      setBadge(RANK_BADGES.gold);
      setStatus('won');
      sound.playLevelUp();
    } else if (profile.xp >= 3000) {
      setBadge(RANK_BADGES.silver);
      setStatus('passed');
      sound.playSuccess();
    } else {
      setBadge(null);
      setStatus('failed');
      sound.playError();
    }
  }, [profile.xp]);

  return (
    <div className="min-h-full flex items-center justify-center p-6 bg-[#0b1221] overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20
          ${status === 'won' ? 'bg-yellow-500' : status === 'passed' ? 'bg-slate-400' : 'bg-red-500'}`}></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full glass p-12 rounded-[40px] border-2 border-white/5 text-center shadow-2xl">
        <div className="mb-8">
           {status === 'won' ? (
             <div className="text-6xl mb-4 animate-bounce">👑</div>
           ) : status === 'passed' ? (
             <div className="text-6xl mb-4">🌟</div>
           ) : (
             <div className="text-6xl mb-4">🌪️</div>
           )}
           <h2 className="text-5xl font-black mb-2 tracking-tighter uppercase italic">
             {status === 'won' ? 'Vô Địch Nexus' : status === 'passed' ? 'Hoàn Thành' : 'Chưa Hoàn Thành'}
           </h2>
           <p className="text-slate-400 font-bold">Kết quả hành trình của bạn</p>
        </div>

        <div className="flex justify-center space-x-12 mb-12">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Tổng điểm</p>
            <p className={`text-5xl font-black ${status === 'won' ? 'text-yellow-400' : 'text-white'}`}>{profile.xp}</p>
            <p className="text-xs font-bold text-slate-500">XP TÍCH LŨY</p>
          </div>
          <div className="w-[1px] h-16 bg-slate-800"></div>
          <div className="text-center">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Cấp độ</p>
            <p className="text-5xl font-black text-sky-400">{profile.level}</p>
            <p className="text-xs font-bold text-slate-500">MAX LEVEL</p>
          </div>
        </div>

        {badge ? (
          <div className="mb-12 p-8 rounded-3xl bg-white/5 border border-white/10 relative group">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sky-500 text-[10px] font-black px-4 py-1 rounded-full shadow-lg">HUY HIỆU ĐÃ NHẬN</div>
            <div className="text-7xl mb-4 filter drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] group-hover:scale-110 transition-transform duration-500">
              {badge.icon}
            </div>
            <h3 className="text-2xl font-black text-white mb-2">{badge.name}</h3>
            <p className="text-sm text-slate-400">{badge.description}</p>
          </div>
        ) : (
          <div className="mb-12 p-8 rounded-3xl bg-red-500/10 border border-red-500/20">
            <h3 className="text-xl font-bold text-red-400 mb-2">Cần nỗ lực hơn!</h3>
            <p className="text-sm text-slate-400">Bạn cần đạt ít nhất 3000 XP để nhận huy hiệu lộ trình. Hãy thử lại để đạt kết quả tốt hơn!</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button 
            onClick={() => { sound.playClick(); onRestart(); }}
            className={`flex-1 py-5 rounded-2xl font-black transition-all hover:scale-105 active:scale-95
              ${status === 'failed' ? 'bg-sky-500 text-white shadow-sky-500/40 shadow-xl' : 'bg-slate-800 text-slate-300'}`}
          >
            {status === 'failed' ? 'THỬ LẠI NGAY' : 'CHƠI LẠI'}
          </button>
          <button 
            onClick={() => { sound.playClick(); onHome(); }}
            className="flex-1 py-5 bg-white text-slate-900 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all"
          >
            VỀ TRANG CHỦ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
