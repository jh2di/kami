import React, { useState } from 'react';
import { Sparkles, UserCheck, ArrowRight, Volume2 } from 'lucide-react';
import { sound, speakKorean } from '../utils/sound';
import { KamibotImage } from './KamibotImage';

interface TitleScreenProps {
  onStart: (playerName: string) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  const [showNameModal, setShowNameModal] = useState(false);
  const [inputName, setInputName] = useState('');

  const handleOpenModal = () => {
    sound.playRobotBeep();
    setShowNameModal(true);
    speakKorean('탐험대원 이름을 알려주세요.');
  };

  const handleConfirmName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sound.playBellChime();
    const finalName = inputName.trim() || '용감한 탐험대원';
    onStart(finalName);
  };

  const handleQuickStart = () => {
    sound.playBellChime();
    onStart('용감한 탐험대원');
  };

  const readTitle = () => {
    speakKorean('마음빛 탐험대: 사라진 선택빛. 탐험대에 지원하기 버튼을 눌러보세요.');
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-between min-h-[calc(100vh-64px)] mt-16 px-4 py-8 pointer-events-auto">
      {/* Top Banner / Theme Tag */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-yellow-300 text-xs sm:text-sm font-semibold shadow-lg backdrop-blur-md animate-fadeIn">
        <Sparkles className="w-4 h-4 text-yellow-400 heart-glow" />
        <span>《인공지능이 뽑은 반장》 카미봇 1차시 수업</span>
      </div>

      {/* Main Title Hero with Immersive UI Glow & Blur Halo */}
      <div className="relative text-center my-auto space-y-5 max-w-xl flex flex-col items-center">
        {/* Yellow Blur Glow Sphere */}
        <div className="w-48 h-48 bg-[#fbbf24] rounded-full opacity-25 blur-3xl absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none"></div>

        {/* Big Glowing Heart Icon */}
        <div className="relative text-[80px] sm:text-[100px] leading-none heart-glow cursor-default select-none">
          💛
        </div>

        <div className="relative space-y-1">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 drop-shadow-[0_4px_24px_rgba(250,204,21,0.5)]">
            마음빛 탐험대
          </h1>
          <p className="text-xl sm:text-2xl tracking-[0.45em] font-light text-yellow-100/60 uppercase">
            사라진 선택빛
          </p>
        </div>

        <p className="text-sm sm:text-base text-blue-100/90 font-medium max-w-md mx-auto leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
          마음빛 마을의 꺼진 선택빛을 되찾기 위해
          <br />
          귀여운 AI 로봇 <strong className="text-yellow-400 font-bold">‘카미’</strong>와 함께 모험을 떠나요!
        </p>

        {/* TTS Read button for young kids */}
        <button
          onClick={readTitle}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-yellow-200 text-xs font-semibold border border-white/15 transition-all shadow-sm active:scale-95"
        >
          <Volume2 className="w-3.5 h-3.5 text-yellow-400" />
          <span>소리로 듣기</span>
        </button>
      </div>

      {/* Bottom Center: Immersive UI Large Pill Button & Floating Kami Greeting */}
      <div className="w-full max-w-md pb-4 flex flex-col items-center gap-5">
        <button
          onClick={handleOpenModal}
          className="w-full sm:w-auto px-10 sm:px-14 py-5 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 text-slate-950 rounded-full text-2xl sm:text-3xl font-black shadow-[0_0_35px_rgba(250,204,21,0.45)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 border-2 border-yellow-200"
        >
          <span>탐험대에 지원하기</span>
          <ArrowRight className="w-7 h-7 stroke-[3]" />
        </button>

        {/* Floating Kami Intro Card */}
        <div className="flex items-center gap-3.5 bg-white/5 px-5 py-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">
          <KamibotImage className="w-12 h-12" />
          <p className="text-sm sm:text-base font-medium text-blue-100">
            안녕! 나는 탐험 로봇 <span className="text-yellow-400 font-black">카미</span>야!
          </p>
        </div>
      </div>

      {/* Name Input Modal (Immersive UI rounded-[40px] with bg-[#1e293b] and backdrop blur) */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#1e293b] border border-white/15 rounded-[40px] p-8 sm:p-12 shadow-2xl text-center space-y-6">
            {/* Robot Kami Badge */}
            <div className="flex justify-center">
              <KamibotImage className="w-20 h-20" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-yellow-200">
                탐험대원 이름을 알려주세요
              </h2>
              <p className="text-sm text-blue-100/70 mt-1">
                임명장에 적힐 멋진 이름을 적어볼까요?
              </p>
            </div>

            <form onSubmit={handleConfirmName} className="space-y-6">
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="예: 민우, 지아 (직접 입력)"
                maxLength={8}
                className="w-full px-6 py-4 rounded-2xl bg-white/10 border-2 border-yellow-400/40 focus:border-yellow-400 text-white placeholder-slate-400 text-center text-xl font-bold outline-none transition-all"
                autoFocus
              />

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleQuickStart}
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-blue-200 text-sm font-semibold transition-all border border-white/10"
                >
                  이름 없이 바로 시작
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-base shadow-lg transition-all active:scale-95 border border-yellow-200"
                >
                  탐험 시작하기!
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
