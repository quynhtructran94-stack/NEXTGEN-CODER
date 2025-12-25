
import React from 'react';

const Leaderboard: React.FC = () => {
  const mockPlayers = [
    { name: 'Hoàng Long', level: 15, xp: 14500, avatar: 'Hoàng' },
    { name: 'Minh Thư', level: 14, xp: 13200, avatar: 'Minh' },
    { name: 'Thanh Sơn', level: 12, xp: 11800, avatar: 'Thanh' },
    { name: 'Bảo Trâm', level: 10, xp: 9500, avatar: 'Bảo' },
    { name: 'Quốc Anh', level: 9, xp: 8700, avatar: 'Quốc' },
  ];

  return (
    <div className="min-h-full p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h2 className="text-4xl font-black mb-2 text-center">BẢNG VINH DANH</h2>
        <p className="text-slate-400 text-center mb-12">Những Codemancer xuất sắc nhất trong hệ thống Nexus.</p>

        <div className="space-y-4">
          {mockPlayers.map((player, index) => (
            <div 
              key={player.name}
              className={`glass p-4 rounded-2xl flex items-center space-x-6 border-slate-800 transition-all hover:border-sky-500/30
                ${index === 0 ? 'bg-sky-500/10 border-sky-500/50' : ''}`}
            >
              <div className={`text-2xl font-black w-8 text-center ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-600' : 'text-slate-600'}`}>
                #{index + 1}
              </div>
              <img 
                src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${player.avatar}`} 
                alt="Avatar" 
                className="w-12 h-12 rounded-xl bg-slate-800"
              />
              <div className="flex-1">
                <h4 className="font-bold text-slate-100">{player.name}</h4>
                <p className="text-xs text-slate-500">LEVEL {player.level}</p>
              </div>
              <div className="text-right">
                 <p className="text-sky-400 font-black">{player.xp}</p>
                 <p className="text-[10px] text-slate-500 font-bold uppercase">XP</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 glass p-8 rounded-3xl bg-indigo-500/5 border-indigo-500/20">
          <h3 className="text-xl font-bold mb-4 text-center">Giá trị sư phạm</h3>
          <ul className="space-y-3 text-sm text-slate-400 list-disc pl-5">
            <li><strong>Luyện tập thực hành:</strong> Mỗi nhiệm vụ là một bài toán cụ thể đòi hỏi học sinh viết code thay vì chỉ đọc lý thuyết.</li>
            <li><strong>AI Scaffolding:</strong> AI không giải bài hộ mà đóng vai trò là "giàn giáo" hỗ trợ, cung cấp gợi ý để học sinh tự tìm ra lỗi.</li>
            <li><strong>Thúc đẩy động lực:</strong> XP, Level và Badges biến quá trình học lập trình khô khan thành một hành trình khám phá.</li>
            <li><strong>Cá nhân hóa:</strong> Phản hồi của AI thay đổi linh hoạt theo từng dòng code cụ thể của từng học sinh.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
