
import React, { useState, useEffect, useRef } from 'react';
import { Mission, Language, AIResponse } from '../types';
import { evaluateResponse } from '../geminiService';
import { sound } from '../services/audioService';

interface MissionEditorProps {
  mission: Mission;
  language: Language;
  onComplete: (id: string, xp: number) => void;
  onBack: () => void;
}

const MissionEditor: React.FC<MissionEditorProps> = ({ mission, language, onComplete, onBack }) => {
  const [userInput, setUserInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<AIResponse | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isQuiz = mission.type === 'quiz';

  // Hiệu ứng pháo hoa bằng Canvas
  useEffect(() => {
    if (feedback?.isCorrect && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles: any[] = [];
      const colors = ['#38bdf8', '#818cf8', '#fbbf24', '#f472b6', '#4ade80'];

      for (let i = 0; i < 150; i++) {
        particles.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          vx: (Math.random() - 0.5) * 20,
          vy: (Math.random() - 0.5) * 20,
          size: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1
        });
      }

      let animationFrame: number;
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.2; // Gravity
          p.alpha -= 0.01;
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          if (p.alpha <= 0) particles.splice(i, 1);
        });
        if (particles.length > 0) {
          animationFrame = requestAnimationFrame(animate);
        }
      };
      animate();
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [feedback]);

  const handleSubmit = async (overrideInput?: string) => {
    const inputToEval = overrideInput || userInput;
    if (!inputToEval && !isQuiz) {
      sound.playError();
      return;
    }
    
    setIsEvaluating(true);
    sound.playClick();
    
    const result = await evaluateResponse(
      language, 
      mission.task, 
      inputToEval, 
      mission.options, 
      mission.correctOption
    );
    
    setFeedback(result);
    setIsEvaluating(false);

    if (result.isCorrect) {
      sound.playVictory();
      // Chuyển cảnh nhanh hơn (1.2s thay vì 2.5s) để giữ flow
      setTimeout(() => {
        onComplete(mission.id, mission.xpReward);
      }, 1200);
    } else {
      sound.playError();
    }
  };

  const handleOptionClick = (index: number) => {
    if (isEvaluating || feedback?.isCorrect) return;
    setSelectedOption(index);
    const chosenText = mission.options?.[index] || '';
    handleSubmit(chosenText);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row bg-[#0b1221] relative overflow-hidden">
      {/* Fireworks Canvas Overlay */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-[100]"
      />

      {/* Sidebar: Mission Info */}
      <div className="w-full lg:w-80 border-r border-slate-800 flex flex-col bg-slate-900/30">
        <div className="p-6 overflow-y-auto flex-1">
          <button 
            onClick={() => { sound.playClick(); onBack(); }} 
            className="text-sky-400 text-sm font-bold mb-6 hover:underline flex items-center"
          >
            ← THOÁT RA BẢN ĐỒ
          </button>
          
          <div className="mb-6">
            <span className="text-[10px] font-bold text-sky-500 tracking-widest uppercase px-2 py-1 bg-sky-500/10 rounded border border-sky-500/20">
              NHIỆM VỤ {mission.order} / 10
            </span>
            <h2 className="text-2xl font-black mt-3 leading-tight text-white">{mission.title}</h2>
          </div>
          
          <div className="glass p-5 rounded-2xl mb-6 bg-white/5 border-white/10">
            <h4 className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest flex items-center">
              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full mr-2"></span>
              Mục tiêu:
            </h4>
            <p className="text-slate-200 text-sm leading-relaxed font-medium">"{mission.task}"</p>
          </div>

          <div className="space-y-3">
             <div className="flex justify-between items-center text-xs p-3 bg-slate-800/40 rounded-xl border border-white/5">
                <span className="text-slate-500">Độ khó</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${mission.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' : mission.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                  {mission.difficulty}
                </span>
             </div>
             <div className="flex justify-between items-center text-xs p-3 bg-slate-800/40 rounded-xl border border-white/5">
                <span className="text-slate-500">Thưởng</span>
                <span className="text-sky-400 font-black">+{mission.xpReward} XP</span>
             </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
           <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-lg shadow-lg shadow-sky-500/20">🤖</div>
              <div>
                <span className="text-xs font-black text-slate-200 uppercase tracking-widest">Nexus AI</span>
                <p className="text-[9px] text-slate-500">Online</p>
              </div>
           </div>
           <p className="text-[11px] text-slate-400 italic">
             {isQuiz ? "Hãy chọn thẻ bài đúng nhất!" : "Viết code và cùng kiểm tra nhé."}
           </p>
        </div>
      </div>

      {/* Main: Workspace */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md z-10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                NEXUS TERMINAL
              </span>
            </div>
          </div>
          {!isQuiz && (
            <button 
              onClick={() => handleSubmit()}
              disabled={isEvaluating || feedback?.isCorrect}
              className={`px-8 py-2.5 rounded-xl font-black text-xs transition-all flex items-center space-x-3
                ${isEvaluating || feedback?.isCorrect
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-white text-slate-900 hover:scale-105 active:scale-95 shadow-xl shadow-white/10'}`}
            >
              {isEvaluating ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent animate-spin rounded-full"></div>
                  <span>ĐANG KIỂM TRA...</span>
                </>
              ) : (
                <>
                  <span>KIỂM TRA ĐÁP ÁN</span>
                  <span className="text-[14px]">▶</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center p-6 bg-[#0d1626] overflow-y-auto relative">
          {isQuiz ? (
            <div className="max-w-3xl w-full py-8">
              <div className="bg-white/5 p-10 rounded-[40px] border border-white/10 mb-10 text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-sky-500 animate-pulse"></div>
                <h3 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">{mission.task}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mission.options?.map((option, index) => {
                  const colors = [
                    'bg-rose-600 hover:bg-rose-500 shadow-rose-600/25',
                    'bg-blue-600 hover:bg-blue-500 shadow-blue-600/25',
                    'bg-amber-600 hover:bg-amber-500 shadow-amber-600/25',
                    'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25'
                  ];
                  return (
                    <button
                      key={index}
                      disabled={isEvaluating || feedback?.isCorrect}
                      onClick={() => handleOptionClick(index)}
                      className={`p-7 rounded-[28px] text-left transition-all duration-300 relative group flex items-center space-x-6 shadow-2xl
                        ${selectedOption === index 
                          ? (feedback?.isCorrect ? 'bg-green-500 scale-[1.05] border-4 border-white' : 'bg-red-500 animate-shake border-4 border-white/40') 
                          : `${colors[index % 4]} hover:-translate-y-2 active:scale-95`}`}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center font-black text-2xl text-white backdrop-blur-sm">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-2xl font-black text-white">{option}</span>
                      
                      {selectedOption === index && feedback?.isCorrect && (
                         <div className="absolute right-8 text-3xl animate-bounce">✨</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col bg-slate-950/50 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl relative">
              <div className="bg-slate-900 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex space-x-2">
                   <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                   <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                   <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">code_editor.io</span>
              </div>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={feedback?.isCorrect}
                placeholder={`# Nhập code tại đây...`}
                className="flex-1 bg-transparent p-8 font-mono text-xl text-sky-100/90 focus:outline-none resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>
          )}
        </div>

        {/* AI Feedback Overlay */}
        {feedback && (
          <div className={`absolute bottom-8 right-8 left-8 md:left-auto md:w-[500px] glass p-8 rounded-[40px] shadow-2xl border-4 animate-in slide-in-from-bottom-10 duration-500 z-[101]
            ${feedback.isCorrect ? 'border-green-500/60 bg-green-500/20' : 'border-red-500/60 bg-red-500/20'}`}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-5">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-4xl shadow-2xl
                  ${feedback.isCorrect ? 'bg-green-500 shadow-green-500/40 animate-pulse' : 'bg-red-500 shadow-red-500/40'}`}>
                  {feedback.isCorrect ? '🏆' : '🔍'}
                </div>
                <div>
                  <h4 className={`font-black text-2xl tracking-tight uppercase italic ${feedback.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {feedback.isCorrect ? 'TUYỆT VỜI!' : 'CỐ GẮNG LÊN'}
                  </h4>
                  <p className="text-[11px] text-slate-400 uppercase tracking-[0.3em] font-black">AI Mentor Feedback</p>
                </div>
              </div>
              {!feedback.isCorrect && (
                <button onClick={() => { sound.playClick(); setFeedback(null); setSelectedOption(null); }} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all">✕</button>
              )}
            </div>
            
            <div className="bg-slate-950/70 p-6 rounded-3xl border border-white/5 mb-6 shadow-inner">
              <p className="text-base text-slate-200 leading-relaxed font-semibold italic">
                "{feedback.feedback}"
              </p>
            </div>

            {!feedback.isCorrect && (
              <div className="bg-sky-500/20 border border-sky-500/30 p-5 rounded-3xl">
                 <div className="flex items-center space-x-3 mb-2">
                   <span className="text-xl">💡</span>
                   <p className="text-[11px] font-black text-sky-400 uppercase tracking-widest">Gợi ý cho bạn:</p>
                 </div>
                 <p className="text-sm italic text-slate-100 leading-relaxed font-medium">"{feedback.hint}"</p>
              </div>
            )}
            
            {feedback.isCorrect && (
              <div className="flex items-center justify-center space-x-5 py-5 bg-white/10 rounded-3xl border border-white/20">
                <div className="w-6 h-6 rounded-full border-4 border-sky-400 border-t-transparent animate-spin"></div>
                <span className="text-sm text-white font-black uppercase tracking-[0.2em]">Đang dịch chuyển...</span>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-15px); }
          75% { transform: translateX(15px); }
        }
        .animate-shake {
          animation: shake 0.12s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default MissionEditor;
