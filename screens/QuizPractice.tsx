
import React, { useState, useEffect, useRef } from 'react';
import { Language, Screen, PracticeQuestion } from '../types';
import { PRACTICE_QUESTION_BANK } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";
import { sound } from '../services/audioService';

interface QuizPracticeProps {
  onBack: () => void;
}

const QuizPractice: React.FC<QuizPracticeProps> = ({ onBack }) => {
  const [phase, setPhase] = useState<'lang' | 'level' | 'play' | 'result'>('lang');
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Hiệu ứng pháo hoa chúc mừng khi hoàn thành xuất sắc
  useEffect(() => {
    if (phase === 'result' && score >= 80 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const particles: any[] = [];
      for (let i = 0; i < 200; i++) {
        particles.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          vx: (Math.random() - 0.5) * 20,
          vy: (Math.random() - 0.5) * 20,
          size: Math.random() * 4 + 2,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`,
          alpha: 1
        });
      }
      let frame: number;
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
          p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.alpha -= 0.01;
          ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
          if (p.alpha <= 0) particles.splice(i, 1);
        });
        if (particles.length > 0) frame = requestAnimationFrame(animate);
      };
      animate();
      return () => cancelAnimationFrame(frame);
    }
  }, [phase, score]);

  const selectLanguage = (lang: Language) => {
    sound.playClick();
    setSelectedLang(lang);
    setPhase('level');
  };

  const selectLevel = (level: number) => {
    sound.playClick();
    setSelectedLevel(level);
    if (selectedLang) {
      setQuestions(PRACTICE_QUESTION_BANK[selectedLang][level]);
      setCurrentQuestionIndex(0);
      setScore(0);
      setPhase('play');
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const isCorrect = index === questions[currentQuestionIndex].correctOption;
    
    if (isCorrect) {
      sound.playSuccess();
      setScore(s => s + 5);
      
      // Chuyển câu hỏi ngay lập tức nếu đúng
      setTimeout(() => {
        proceedNext();
      }, 300);
    } else {
      sound.playError();
      // Delay lâu hơn một chút nếu sai
      setTimeout(() => {
        proceedNext();
      }, 800);
    }
  };

  const proceedNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(idx => idx + 1);
      setSelectedAnswer(null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setPhase('result');
    setIsEvaluating(true);
    sound.playVictory();

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Học sinh vừa hoàn thành bài luyện tập trắc nghiệm chuyên sâu ${selectedLang} cấp độ ${selectedLevel}.
                  Kết quả cuối cùng: ${score}/100.
                  Hãy đưa ra một lời nhận xét mang tính sư phạm, khích lệ và chỉ ra hướng phát triển tiếp theo dựa trên điểm số này (tiếng Việt).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: { feedback: { type: Type.STRING } },
            required: ["feedback"]
          }
        }
      });
      const data = JSON.parse(response.text || '{}');
      setAiFeedback(data.feedback || "Kết quả rất ấn tượng! Hãy tiếp tục duy trì phong độ này.");
    } catch (e) {
      setAiFeedback("Chúc mừng bạn đã hoàn thành xuất sắc bài luyện tập trắc nghiệm!");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center p-6 bg-[#0b1221] relative overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
      
      <div className="max-w-4xl w-full relative z-10">
        {phase !== 'lang' && (
          <button 
            onClick={() => {
              if (phase === 'level') setPhase('lang');
              else if (phase === 'play') setPhase('level');
              else setPhase('lang');
              sound.playClick();
            }}
            className="absolute -top-16 left-0 text-sky-400 font-bold flex items-center hover:underline transition-all hover:-translate-x-1"
          >
            <span className="mr-2">←</span> QUAY LẠI
          </button>
        )}

        {phase === 'lang' && (
          <div className="text-center animate-in fade-in zoom-in duration-500">
            <h2 className="text-6xl font-black mb-12 tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">Thư viện câu hỏi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <button onClick={() => selectLanguage(Language.PYTHON)} className="group glass p-12 rounded-[40px] border-2 border-blue-500/20 hover:border-blue-500/60 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 bg-blue-500/5">
                <div className="text-8xl mb-6 group-hover:rotate-12 transition-transform">🐍</div>
                <h3 className="text-4xl font-black uppercase italic">Python</h3>
                <p className="text-slate-400 mt-4 font-medium italic">Thử thách 100 câu trắc nghiệm</p>
              </button>
              <button onClick={() => selectLanguage(Language.HTML)} className="group glass p-12 rounded-[40px] border-2 border-red-500/20 hover:border-red-500/60 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 bg-red-500/5">
                <div className="text-8xl mb-6 group-hover:-rotate-12 transition-transform">🌐</div>
                <h3 className="text-4xl font-black uppercase italic">HTML</h3>
                <p className="text-slate-400 mt-4 font-medium italic">Thử thách 100 câu trắc nghiệm</p>
              </button>
            </div>
            
            <button 
              onClick={onBack}
              className="px-12 py-4 rounded-[20px] bg-white/10 text-white font-black uppercase tracking-[0.2em] border border-white/20 hover:bg-white/20 transition-all active:scale-95"
            >
              Quay về trung tâm
            </button>
          </div>
        )}

        {phase === 'level' && selectedLang && (
          <div className="text-center animate-in slide-in-from-right duration-500">
            <h2 className="text-5xl font-black mb-4 uppercase tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">CHỌN CẤP ĐỘ THỬ THÁCH</h2>
            <p className="text-slate-400 mb-12 font-medium">Ngôn ngữ: {selectedLang} • 20 câu hỏi mỗi cấp độ</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5].map(lvl => (
                <button 
                  key={lvl}
                  onClick={() => selectLevel(lvl)}
                  className="glass aspect-square rounded-[32px] flex flex-col items-center justify-center hover:bg-white/10 transition-all group hover:-translate-y-2 border border-white/10"
                >
                  <span className="text-5xl font-black text-white group-hover:scale-125 transition-transform duration-300">{lvl}</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase mt-3 tracking-[0.3em]">CẤP ĐỘ</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'play' && questions[currentQuestionIndex] && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-end mb-10">
               <div className="flex-1 mr-8">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="bg-sky-500 text-white font-black px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest">CÂU HỎI {currentQuestionIndex + 1} / 20</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">{questions[currentQuestionIndex].question}</h3>
               </div>
               <div className="text-right glass p-4 rounded-2xl border-amber-500/30 bg-amber-500/5 min-w-[100px]">
                  <p className="text-[10px] text-amber-500/70 font-black uppercase tracking-widest">ĐIỂM SỐ</p>
                  <p className="text-4xl font-black text-amber-500">{score}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               {questions[currentQuestionIndex].options.map((opt, i) => (
                 <button
                  key={i}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswer(i)}
                  className={`p-7 rounded-[30px] text-left transition-all text-xl font-bold flex items-center space-x-5 shadow-xl border-2
                    ${selectedAnswer === i 
                      ? (i === questions[currentQuestionIndex].correctOption ? 'bg-green-500 border-white text-white scale-105' : 'bg-red-500 border-white text-white animate-shake')
                      : 'glass border-transparent hover:border-white/20 hover:bg-white/10 text-slate-200'}`}
                 >
                   <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-lg font-black backdrop-blur-md">{String.fromCharCode(65 + i)}</div>
                   <span className="flex-1 leading-tight">{opt}</span>
                   {selectedAnswer === i && i === questions[currentQuestionIndex].correctOption && (
                     <span className="text-2xl animate-bounce">✨</span>
                   )}
                 </button>
               ))}
            </div>

            <div className="mt-16 relative">
               <div className="h-3 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-300" 
                    style={{ width: `${((currentQuestionIndex + 1) / 20) * 100}%` }}
                  />
               </div>
               <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-600 uppercase tracking-widest">Tiến trình luyện tập</div>
            </div>
          </div>
        )}

        {phase === 'result' && (
          <div className="text-center glass p-12 rounded-[50px] animate-in zoom-in duration-500 border-2 border-white/5 shadow-2xl">
             <div className="text-8xl mb-8 animate-bounce">{score >= 80 ? '🏆' : score >= 50 ? '🌟' : '📖'}</div>
             <h2 className="text-6xl font-black mb-2 uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">TỔNG KẾT LUYỆN TẬP</h2>
             <p className="text-sky-400 font-black mb-12 tracking-[0.2em] uppercase">{selectedLang} • Cấp độ {selectedLevel}</p>

             <div className="inline-flex flex-col items-center bg-white/5 p-10 rounded-[40px] border border-white/10 mb-12 shadow-inner">
                   <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-2">Điểm số đạt được</p>
                   <p className="text-8xl font-black text-white tracking-tighter">{score}<span className="text-3xl text-slate-600 ml-2">/100</span></p>
             </div>

             <div className="max-w-xl mx-auto bg-gradient-to-br from-sky-500/10 to-indigo-500/10 p-8 rounded-[35px] border border-sky-500/20 mb-12 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sky-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg">Đánh giá chuyên gia AI</div>
                <div className="mt-4">
                  {isEvaluating ? (
                    <div className="flex flex-col items-center py-6">
                      <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent animate-spin rounded-full mb-4"></div>
                      <span className="text-sm italic text-slate-400 font-medium">Nexus AI đang phân tích dữ liệu...</span>
                    </div>
                  ) : (
                    <p className="text-xl italic text-slate-200 leading-relaxed font-semibold">"{aiFeedback}"</p>
                  )}
                </div>
             </div>

             <div className="flex flex-col md:flex-row gap-6 justify-center">
                <button onClick={() => { sound.playClick(); setPhase('lang'); }} className="px-12 py-5 bg-sky-500 text-white rounded-[24px] font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-sky-500/20 uppercase tracking-widest">Luyện tập lại</button>
                <button onClick={onBack} className="px-12 py-5 bg-white text-slate-900 rounded-[24px] font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl uppercase tracking-widest">Về trang chủ</button>
             </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-12px); }
          75% { transform: translateX(12px); }
        }
        .animate-shake {
          animation: shake 0.1s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default QuizPractice;
