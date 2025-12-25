
import React from 'react';
import { Language, Screen } from '../types';
import { sound } from '../services/audioService';

interface SelectionProps {
  onSelect: (l: Language) => void;
  onNavigate: (s: Screen) => void;
}

const Selection: React.FC<SelectionProps> = ({ onSelect, onNavigate }) => {
  return (
    <div className="min-h-full flex flex-col items-center justify-center p-8 overflow-y-auto bg-[#0f172a]">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-top duration-700">
        <h2 className="text-6xl font-black mb-4 tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-white to-indigo-400">
          TRUNG TÂM ĐIỀU KHIỂN
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-xl font-medium">
          Lựa chọn sức mạnh lập trình hoặc rèn luyện kỹ năng tại thư viện Nexus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl animate-in zoom-in duration-500">
        {/* Nút Python */}
        <button
          onClick={() => onSelect(Language.PYTHON)}
          className="group relative glass p-10 rounded-[45px] text-center transition-all hover:-translate-y-4 border-2 border-blue-500/20 hover:border-blue-500/60 hover:shadow-[0_20px_50px_rgba(59,130,246,0.2)] bg-blue-500/5"
        >
          <div className="w-24 h-24 bg-blue-500 rounded-3xl flex items-center justify-center text-6xl mb-8 mx-auto shadow-xl shadow-blue-500/40 group-hover:scale-110 group-hover:rotate-6 transition-transform">
            🐍
          </div>
          <h3 className="text-4xl font-black mb-4 text-white uppercase italic">Python</h3>
          <p className="text-slate-400 leading-relaxed mb-8 font-medium">
            Bắt đầu hành trình chinh phục ngôn ngữ lập trình phổ biến nhất thế giới.
          </p>
          <div className="inline-flex items-center text-blue-400 font-black uppercase text-sm tracking-widest border-b-2 border-blue-400/30 pb-1 group-hover:border-blue-400 transition-all">
            Vào hành trình <span>→</span>
          </div>
        </button>

        {/* Nút HTML */}
        <button
          onClick={() => onSelect(Language.HTML)}
          className="group relative glass p-10 rounded-[45px] text-center transition-all hover:-translate-y-4 border-2 border-red-500/20 hover:border-red-500/60 hover:shadow-[0_20px_50px_rgba(239,68,68,0.2)] bg-red-500/5"
        >
          <div className="w-24 h-24 bg-red-500 rounded-3xl flex items-center justify-center text-6xl mb-8 mx-auto shadow-xl shadow-red-500/40 group-hover:scale-110 group-hover:-rotate-6 transition-transform">
            🌐
          </div>
          <h3 className="text-4xl font-black mb-4 text-white uppercase italic">HTML</h3>
          <p className="text-slate-400 leading-relaxed mb-8 font-medium">
            Xây dựng nền tảng web vững chắc và kiến tạo giao diện hiện đại.
          </p>
          <div className="inline-flex items-center text-red-400 font-black uppercase text-sm tracking-widest border-b-2 border-red-400/30 pb-1 group-hover:border-red-400 transition-all">
            Vào hành trình <span>→</span>
          </div>
        </button>

        {/* Nút Thư viện câu hỏi */}
        <button
          onClick={() => { sound.playClick(); onNavigate(Screen.QUIZ_PRACTICE_SELECT); }}
          className="group relative glass p-10 rounded-[45px] text-center transition-all hover:-translate-y-4 border-2 border-amber-500/20 hover:border-amber-500/60 hover:shadow-[0_20px_50px_rgba(245,158,11,0.2)] bg-amber-500/5"
        >
          <div className="w-24 h-24 bg-amber-500 rounded-3xl flex items-center justify-center text-6xl mb-8 mx-auto shadow-xl shadow-amber-500/40 group-hover:scale-110 transition-transform">
            📚
          </div>
          <h3 className="text-4xl font-black mb-4 text-white uppercase italic leading-tight">Thư viện<br/>câu hỏi</h3>
          <p className="text-slate-400 leading-relaxed mb-8 font-medium">
            Rèn luyện kỹ năng trắc nghiệm với kho câu hỏi đa dạng và chuyên sâu.
          </p>
          <div className="inline-flex items-center text-amber-500 font-black uppercase text-sm tracking-widest border-b-2 border-amber-500/30 pb-1 group-hover:border-amber-500 transition-all">
            Bắt đầu luyện tập <span>→</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Selection;
