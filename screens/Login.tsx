
import React, { useState } from 'react';
import { sound } from '../services/audioService';

interface LoginProps {
  onLogin: (name: string, className: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !className.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin để bắt đầu hành trình!');
      sound.playError();
      return;
    }
    sound.playClick();
    onLogin(name, className);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0f172a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-lime-500/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-sky-500 to-lime-500 rounded-[24px] flex items-center justify-center text-3xl font-black shadow-2xl shadow-lime-500/20 mx-auto mb-6 text-white italic">
            NG
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase italic">NextGen Coder</h1>
          <p className="text-slate-400 font-medium">Khởi tạo hồ sơ học viên của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="glass p-10 rounded-[40px] border-2 border-white/5 shadow-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Họ và tên học sinh</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="Ví dụ: Nguyễn Văn A"
              className="w-full bg-slate-900/50 border-2 border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-lime-500/50 transition-all font-bold placeholder:text-slate-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Lớp / Nhóm học tập</label>
            <input
              type="text"
              value={className}
              onChange={(e) => { setClassName(e.target.value); setError(''); }}
              placeholder="Ví dụ: 6A1"
              className="w-full bg-slate-900/50 border-2 border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-lime-500/50 transition-all font-bold placeholder:text-slate-600"
            />
          </div>

          {error && <p className="text-rose-500 text-xs font-bold text-center animate-bounce">{error}</p>}

          <button
            type="submit"
            className="w-full py-5 bg-gradient-to-r from-sky-500 to-lime-500 text-white rounded-[24px] font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-lime-500/20 uppercase tracking-[0.2em] mt-4"
          >
            Vào Hệ Thống
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600 text-[10px] font-black uppercase tracking-widest">
          Nexus Security Protocol v3.1.0
        </p>
      </div>
    </div>
  );
};

export default Login;
