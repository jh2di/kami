import React, { useState, useEffect } from 'react';
import { Volume2, Play, ChevronRight, AlertTriangle } from 'lucide-react';
import { sound, speakKorean } from '../utils/sound';
import { KamibotImage } from './KamibotImage';

interface IntroCutsceneProps {
  onComplete: () => void;
  playerName: string;
}

export const IntroCutscene: React.FC<IntroCutsceneProps> = ({ onComplete, playerName }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const stories = [
    {
      badge: '삐- 삐- 긴급 알림',
      speaker: '긴급 신호',
      text: '긴급 신호가 도착했어요!',
      sub: '마음빛 마을에 이상한 일이 일어났어요.',
      icon: '🚨',
    },
    {
      badge: '마을의 위기',
      speaker: '이야기',
      text: '마음빛 마을의 친구들이 모든 선택을 인공지능 추천이에게 맡기고 있어요.',
      sub: '음식도, 놀이도, 옷도 추천이 말만 따랐대요.',
      icon: '🏘️',
    },
    {
      badge: '사라진 빛',
      speaker: '이야기',
      text: '친구들이 스스로 생각하지 않으면서 노란색 선택빛이 사라졌어요.',
      sub: '마을 광장의 하트 보석이 차갑게 어두워졌어요.',
      icon: '💔',
    },
    {
      badge: '탐험대 출동',
      speaker: '탐험대 본부',
      text: `${playerName} 탐험대원님, 카미와 함께 세 가지 임무를 해결하고 선택빛을 되찾아 주세요!`,
      sub: '스스로 생각하는 힘을 모으면 선택빛이 다시 켜져요!',
      icon: '✨',
    },
    {
      badge: '카미의 다짐',
      speaker: '탐험로봇 카미',
      text: '“나는 길을 찾도록 도와줄 수 있지만, 마지막 결정은 네가 해줘야 해!”',
      sub: '카미와 손을 잡고 첫 번째 임무로 출발해 볼까요?',
      icon: '🤖',
    },
  ];

  // Play emergency signal on mount
  useEffect(() => {
    sound.playEmergencySignal();
    speakKorean(stories[0].text);
  }, []);

  const handleNext = () => {
    sound.playRobotBeep();
    if (currentStep < stories.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      speakKorean(stories[next].text);
    } else {
      sound.playBellChime();
      onComplete();
    }
  };

  const handleReadCurrent = () => {
    speakKorean(stories[currentStep].text);
  };

  const currentStory = stories[currentStep];
  const isLast = currentStep === stories.length - 1;

  return (
    <div className="relative z-10 flex flex-col items-center justify-between min-h-[calc(100vh-64px)] mt-16 px-4 py-8 pointer-events-auto">
      {/* Top Progress Dots */}
      <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        {stories.map((_, idx) => (
          <div
            key={idx}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === currentStep
                ? 'w-8 bg-yellow-400 shadow-[0_0_12px_#facc15]'
                : idx < currentStep
                ? 'w-2.5 bg-blue-400'
                : 'w-2.5 bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Main Dialogue / Story Card in Immersive UI aesthetic */}
      <div className="w-full max-w-xl bg-[#1e293b]/90 border border-white/15 rounded-[40px] p-8 sm:p-10 backdrop-blur-xl shadow-2xl space-y-6 text-center my-auto transition-all animate-fadeIn">
        {/* Speaker Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 text-xs sm:text-sm font-bold shadow-sm">
          <span className="text-lg">{currentStory.icon}</span>
          <span>{currentStory.badge}</span>
        </div>

        {currentStory.icon === '🤖' && (
          <div className="flex justify-center pt-1">
            <KamibotImage className="w-20 h-20" />
          </div>
        )}

        {/* Large Narration Text */}
        <div className="space-y-3">
          <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-snug break-keep drop-shadow-md">
            {currentStory.text}
          </p>
          <p className="text-sm sm:text-base text-yellow-300/90 font-medium">
            {currentStory.sub}
          </p>
        </div>

        {/* Voice Read Button */}
        <div className="pt-2">
          <button
            onClick={handleReadCurrent}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-yellow-300 text-xs sm:text-sm font-bold border border-white/15 transition-all active:scale-95 shadow-md"
          >
            <Volume2 className="w-4 h-4 text-yellow-400" />
            <span>음성으로 다시 듣기</span>
          </button>
        </div>
      </div>

      {/* Bottom Action Button (Immersive UI pill button) */}
      <div className="w-full max-w-sm pb-6">
        <button
          onClick={handleNext}
          className={`w-full py-5 px-8 rounded-full font-black text-xl sm:text-2xl flex items-center justify-center gap-3 transition-all duration-200 active:scale-95 shadow-2xl ${
            isLast
              ? 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 shadow-[0_0_30px_rgba(250,204,21,0.45)] border-2 border-yellow-200'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_25px_rgba(37,99,235,0.4)] border border-blue-400/40'
          }`}
        >
          {isLast ? (
            <>
              <span>임무 시작!</span>
              <Play className="w-6 h-6 fill-slate-950 stroke-none" />
            </>
          ) : (
            <>
              <span>다음 이야기</span>
              <ChevronRight className="w-6 h-6 stroke-[3]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
