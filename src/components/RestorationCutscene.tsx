import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, ArrowRight, Volume2, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound, speakKorean } from '../utils/sound';
import { KamibotImage } from './KamibotImage';

interface RestorationCutsceneProps {
  onComplete: () => void;
  playerName: string;
}

export const RestorationCutscene: React.FC<RestorationCutsceneProps> = ({
  onComplete,
  playerName,
}) => {
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);
  const words = ['인공지능은', '도와주고,', '마지막', '선택은', '내가', '해요!'];

  useEffect(() => {
    // Play fanfare and initial celebration
    sound.playCelebrationFanfare();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#facc15', '#38bdf8', '#fbbf24', '#ffffff'],
    });

    const speakDialogue = async () => {
      speakKorean('추천이는 도와줄 수 있지만 언제나 맞는 것은 아니에요. 마지막 선택을 해 준 사람은 바로 너야!');
    };
    speakDialogue();

    // Word illumination sequence
    const timers: NodeJS.Timeout[] = [];
    words.forEach((_, idx) => {
      const timer = setTimeout(() => {
        setActiveWordIndex(idx);
        sound.playBellChime();
      }, 3500 + idx * 600);
      timers.push(timer);
    });

    // Speak the core slogan at the end
    const finalTimer = setTimeout(() => {
      speakKorean('인공지능은 도와주고, 마지막 선택은 내가 해요!');
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#ffd700', '#f59e0b', '#38bdf8'],
      });
    }, 3500 + words.length * 600 + 400);
    timers.push(finalTimer);

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleReadSlogan = () => {
    speakKorean('인공지능은 도와주고, 마지막 선택은 내가 해요!');
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-between min-h-[calc(100vh-64px)] mt-16 px-4 py-6 pointer-events-auto select-none">
      {/* Top Banner */}
      <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-yellow-400/40 text-yellow-300 text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(250,204,21,0.3)] backdrop-blur-md">
        <Sparkles className="w-4 h-4 text-yellow-400 heart-glow" />
        <span>마음빛 마을의 선택빛이 찬란하게 회복되었어요!</span>
      </div>

      {/* Main Core Content Card */}
      <div className="w-full max-w-2xl my-auto space-y-6 text-center">
        {/* Glowing Heart with Halo */}
        <div className="relative flex justify-center">
          <div className="w-40 h-40 bg-[#fbbf24] rounded-full opacity-20 blur-3xl absolute -top-4 pointer-events-none"></div>
          <div className="relative text-[80px] sm:text-[100px] leading-none heart-glow cursor-default select-none">
            💛
          </div>
        </div>

        {/* Kami and Chucheon-i Dialogues */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto items-stretch">
          <div className="p-4 rounded-2xl bg-white/5 border border-cyan-400/30 text-cyan-200 text-sm sm:text-base font-bold shadow-lg backdrop-blur-md flex flex-col justify-center">
            <div className="text-xs text-cyan-400 mb-1">💙 인공지능 추천이</div>
            “추천은 도와줄 수 있지만, 언제나 맞는 것은 아니에요.”
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-blue-400/30 text-blue-200 text-sm sm:text-base font-bold shadow-lg backdrop-blur-md flex items-center gap-3 text-left">
            <KamibotImage className="w-14 h-14 shrink-0" />
            <div>
              <div className="text-xs text-blue-400 mb-0.5">🤖 탐험로봇 카미</div>
              “마지막 선택을 해 준 사람은 바로 {playerName} 너야!”
            </div>
          </div>
        </div>

        {/* Central Core Slogan: Animated Glowing Words in Immersive UI card */}
        <div className="p-8 sm:p-10 rounded-[40px] bg-[#1e293b]/95 border border-white/15 backdrop-blur-xl shadow-2xl space-y-5">
          <div className="text-xs sm:text-sm font-bold text-yellow-300 tracking-widest uppercase">
            ★ 마음빛 탐험대의 영원한 약속 ★
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-2xl sm:text-4xl md:text-5xl font-black leading-tight">
            {words.map((word, idx) => {
              const isLit = activeWordIndex >= idx;
              const isCurrent = activeWordIndex === idx;

              return (
                <span
                  key={idx}
                  className={`transition-all duration-300 px-3 py-1 rounded-2xl ${
                    isCurrent
                      ? 'bg-yellow-400 text-slate-950 scale-110 shadow-[0_0_25px_#facc15]'
                      : isLit
                      ? 'text-yellow-300 drop-shadow-[0_2px_12px_rgba(250,204,21,0.6)]'
                      : 'text-white/20'
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </div>

          <button
            onClick={handleReadSlogan}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-yellow-300 text-xs sm:text-sm font-bold border border-white/15 transition-all shadow-sm active:scale-95"
          >
            <Volume2 className="w-4 h-4 text-yellow-400" />
            <span>약속 문장 함께 읽기</span>
          </button>
        </div>
      </div>

      {/* Bottom Button (Immersive UI rounded-full pill button) */}
      <div className="w-full max-w-sm pb-6">
        <button
          onClick={() => {
            sound.playBellChime();
            onComplete();
          }}
          className="w-full py-5 px-8 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xl sm:text-2xl flex items-center justify-center gap-3 shadow-[0_0_35px_rgba(250,204,21,0.5)] transition-all duration-200 active:scale-95 border-2 border-yellow-200"
        >
          <Award className="w-6 h-6 stroke-[2.5]" />
          <span>임명식 보러 가기</span>
          <ArrowRight className="w-6 h-6 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
