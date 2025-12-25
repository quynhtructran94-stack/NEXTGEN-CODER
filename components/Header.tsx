
import React, { useState } from 'react';
import { UserProfile, Screen } from '../types';
import { sound } from '../services/audioService';

interface HeaderProps {
  profile: UserProfile;
  onNavigate: (s: Screen) => void;
  onLanguageChange: () => void;
}

const Header: React.FC<HeaderProps> = ({ profile, onNavigate, onLanguageChange }) => {
  const [isMusicOn, setIsMusicOn] = useState(false);
  const progress = ((profile.xp % 1000) / 1000) * 100;

  const toggleMusic = () => {
    const newState = !isMusicOn;
    setIsMusicOn(newState);
    sound.toggleMusic(newState);
    sound.playClick();
  };

  return (
    <header className="glass sticky top-0 z-50 px-6 py-3 flex items-center justify-between border-b border-white/5 shadow-xl">
      <div 
        className="flex items-center space-x-3 cursor-pointer group" 
        onClick={() => onNavigate(Screen.HOME)}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-lime-500 rounded-lg flex items-center justify-center text-xl font-bold text-white italic shadow-lg shadow-lime-500/20 group-hover:scale-110 transition-transform">
          NG
        </div>
        <span className="text-xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400 uppercase italic hidden sm:block">
          NextGen Coder
        </span>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="flex justify-between text-[10px] mb-1 font-bold text-slate-500 tracking-wider">
          <span className="text-sky-400">LEVEL {profile.level}</span>
          <span className="text-lime-400">{profile.xp % 1000} / 1000 XP</span>
        </div>
        <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-sky-400 to-lime-400 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(204,255,0,0.4)]" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Music Toggle */}
        <button 
          onClick={toggleMusic}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isMusicOn ? 'bg-lime-500/20 text-lime-400 border border-lime-500/30 shadow-[0_0_10px_rgba(204,255,0,0.2)]' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}
          title={isMusicOn ? "Tắt nhạc nền" : "Bật nhạc nền"}
        >
          {isMusicOn ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 3v11a4 4 0 102 3.586V7.12l9-1.8v6.266A4 4 0 1018 15V3z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <button 
          onClick={onLanguageChange}
          className="px-4 py-2 text-xs font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-lime-500/30"
        >
          Trung tâm
        </button>
        
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
          <div className="text-right hidden lg:block">
            <p className="text-xs font-black text-slate-100">{profile.name}</p>
            <p className="text-[9px] text-lime-400 uppercase tracking-tighter font-black">Lớp {profile.className}</p>
          </div>
          <img 
            src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${profile.name}`} 
            alt="Avatar" 
            className="w-10 h-10 rounded-xl border border-lime-500/20 shadow-lg shadow-lime-500/5 bg-slate-800/50 p-0.5"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
