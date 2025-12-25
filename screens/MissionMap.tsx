
import React from 'react';
import { Language, Mission } from '../types';

interface MissionMapProps {
  language: Language;
  missions: Mission[];
  onSelectMission: (m: Mission) => void;
}

const MissionMap: React.FC<MissionMapProps> = ({ language, missions, onSelectMission }) => {
  return (
    <div className="min-h-full p-12 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black tracking-widest uppercase mb-3">
               Khu vực: {language}
            </div>
            <h2 className="text-4xl font-black">Bản Đồ Hành Trình</h2>
            <p className="text-slate-400 mt-2">Vượt qua các câu đố trắc nghiệm để mở khóa phòng thực hành code.</p>
          </div>
          <div className="glass px-6 py-4 rounded-2xl flex items-center space-x-6">
             <div className="text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Tiến độ</p>
                <p className="text-2xl font-black text-sky-400">
                   {missions.filter(m => m.completed).length}/{missions.length}
                </p>
             </div>
             <div className="w-[1px] h-8 bg-slate-800"></div>
             <div className="text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Trạng thái</p>
                <p className="text-xs font-bold text-slate-200">
                  {missions.every(m => m.type === 'quiz' || m.completed) ? 'Đã sẵn sàng Code' : 'Đang khởi động'}
                </p>
             </div>
          </div>
        </div>

        <div className="relative space-y-8">
          {/* Path Line */}
          <div className="absolute left-[39px] top-10 bottom-10 w-1 bg-gradient-to-b from-sky-500/20 via-sky-500/50 to-sky-500/20"></div>

          {missions.map((mission, index) => (
            <div 
              key={mission.id}
              className={`relative flex items-center space-x-8 transition-all ${!mission.unlocked ? 'opacity-40 grayscale pointer-events-none' : 'hover:scale-[1.01]'}`}
            >
              {/* Node Icon */}
              <div 
                className={`relative z-10 w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-2xl transition-all duration-500
                ${mission.completed 
                  ? 'bg-green-500 scale-90' 
                  : mission.unlocked 
                    ? (mission.type === 'quiz' ? 'bg-yellow-500' : 'bg-sky-500') 
                    : 'bg-slate-800 border border-slate-700'}`}
              >
                <span className="text-2xl font-black">{mission.completed ? '✓' : (mission.type === 'quiz' ? '⚡' : '⌨️')}</span>
                <span className="text-[10px] font-black mt-1 opacity-70 uppercase tracking-tighter">
                  {mission.type === 'quiz' ? 'Quiz' : 'Code'}
                </span>
                
                {mission.unlocked && !mission.completed && (
                  <div className={`absolute inset-0 rounded-2xl animate-ping opacity-20 ${mission.type === 'quiz' ? 'bg-yellow-400' : 'bg-sky-400'}`}></div>
                )}
              </div>

              {/* Mission Card */}
              <div className={`flex-1 glass p-6 rounded-3xl flex items-center justify-between border-l-4 
                ${mission.type === 'quiz' ? 'border-l-yellow-500' : 'border-l-sky-500'}`}>
                <div className="pr-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-[0.1em]
                      ${mission.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' : mission.difficulty === 'Medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}`}>
                      {mission.difficulty}
                    </span>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-white/5 text-slate-400 uppercase tracking-widest">
                      +{mission.xpReward} XP
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-100">{mission.title}</h3>
                  <p className="text-slate-400 text-sm mt-1 line-clamp-1 italic">"{mission.description}"</p>
                </div>

                <button
                  disabled={!mission.unlocked}
                  onClick={() => onSelectMission(mission)}
                  className={`px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl
                    ${mission.completed 
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-default' 
                      : mission.unlocked 
                        ? (mission.type === 'quiz' ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-900 shadow-yellow-500/20' : 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/20')
                        : 'bg-slate-800 text-slate-600'}`}
                >
                  {mission.completed ? 'HOÀN THÀNH' : mission.unlocked ? 'VÀO TRẬN' : 'ĐANG KHÓA'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MissionMap;
