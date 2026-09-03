import React, { useState } from 'react';
import { Sparkles, Heart, ArrowRight, Volume2, CheckCircle } from 'lucide-react';
import { sound, speakKorean } from '../utils/sound';
import { Mission1Step } from '../types';
import { KamibotImage } from './KamibotImage';

interface Mission1ChoiceProps {
  onComplete: () => void;
  onChoiceHighlight?: (choiceIndex: number) => void;
}

export const Mission1Choice: React.FC<Mission1ChoiceProps> = ({
  onComplete,
  onChoiceHighlight,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedInStep, setSelectedInStep] = useState<string | null>(null);
  const [showKamiCheer, setShowKamiCheer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const steps: Mission1Step[] = [
    {
      id: 1,
      prompt: '내가 더 먹고 싶은 아이스크림 문을 골라봐요!',
      options: [
        {
          id: 'strawberry',
          title: '딸기맛 아이스크림',
          subText: '상큼하고 달콤한 딸기',
          emoji: '🍓',
          color: 'from-pink-500 to-rose-600',
        },
        {
          id: 'choco',
          title: '초코맛 아이스크림',
          subText: '진하고 부드러운 초코',
          emoji: '🍫',
          color: 'from-amber-600 to-amber-800',
        },
      ],
    },
    {
      id: 2,
      prompt: '지금 더 하고 싶은 놀이 문을 골라봐요!',
      options: [
        {
          id: 'soccer',
          title: '축구하기',
          subText: '친구들과 신나게 달리기',
          emoji: '⚽',
          color: 'from-emerald-500 to-green-700',
        },
        {
          id: 'drawing',
          title: '그림 그리기',
          subText: '알록달록 예쁘게 그리기',
          emoji: '🎨',
          color: 'from-purple-500 to-indigo-600',
        },
      ],
    },
    {
      id: 3,
      prompt: '내가 더 좋아하는 귀여운 동물 문을 골라봐요!',
      options: [
        {
          id: 'dog',
          title: '강아지',
          subText: '꼬리를 흔드는 강아지',
          emoji: '🐶',
          color: 'from-orange-400 to-amber-600',
        },
        {
          id: 'cat',
          title: '고양이',
          subText: '포근하고 조용한 고양이',
          emoji: '🐱',
          color: 'from-cyan-500 to-blue-600',
        },
      ],
    },
  ];

  const currentStep = steps[stepIndex];

  const handleSelect = (optionIndex: number, optionTitle: string) => {
    if (selectedInStep !== null) return; // prevent double click
    setSelectedInStep(optionTitle);
    if (onChoiceHighlight) onChoiceHighlight(optionIndex);

    sound.playBellChime();
    sound.playRobotBeep();
    setShowKamiCheer(true);

    const cheerText = '좋은 선택이야! 친구마다 좋아하는 것은 다를 수 있어.';
    speakKorean(cheerText);

    setTimeout(() => {
      setShowKamiCheer(false);
      setSelectedInStep(null);

      if (stepIndex < steps.length - 1) {
        setStepIndex(stepIndex + 1);
      } else {
        // All 3 completed!
        setIsFinished(true);
        sound.playCelebrationFanfare();
        speakKorean('첫 번째 마음빛 발견! 내 마음은 내가 살펴봐요.');
      }
    }, 1800);
  };

  const handleReadPrompt = () => {
    speakKorean(currentStep.prompt);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-between min-h-[calc(100vh-64px)] mt-16 px-4 py-6 pointer-events-auto">
      {/* Top Mission Tracker */}
      <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <span className="text-xs sm:text-sm font-black text-yellow-300">임무 1: 나의 선택 찾기</span>
        <div className="flex gap-2">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                idx < stepIndex || isFinished
                  ? 'bg-yellow-400 ring-2 ring-yellow-300 shadow-[0_0_8px_#facc15]'
                  : idx === stepIndex
                  ? 'bg-blue-400 animate-pulse'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {!isFinished ? (
        /* Active Door Question */
        <div className="w-full max-w-3xl my-auto space-y-6 text-center">
          {/* Prompt Header */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-white drop-shadow-md">
              {currentStep.prompt}
            </h2>
            <p className="text-sm sm:text-base text-blue-200">
              좋아하는 것을 골라보세요. 친구마다 생각이 다를 수 있어요!
            </p>
            <button
              onClick={handleReadPrompt}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-yellow-300 text-xs sm:text-sm font-bold border border-white/15 transition-all shadow-sm active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-yellow-400" />
              <span>소리로 듣기</span>
            </button>
          </div>

          {/* Two Interactive Immersive UI Choice Cards (rounded-[40px] glass cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {currentStep.options.map((opt, idx) => {
              const isChosen = selectedInStep === opt.title;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(idx, opt.title)}
                  disabled={selectedInStep !== null}
                  className={`group relative p-8 sm:p-10 rounded-[40px] text-center backdrop-blur-xl transition-all duration-300 active:scale-95 border-2 ${
                    isChosen
                      ? 'bg-yellow-400/25 border-yellow-400 scale-105 shadow-[0_0_35px_rgba(250,204,21,0.5)] ring-2 ring-yellow-300'
                      : 'bg-white/5 hover:bg-yellow-400/15 border-white/10 hover:border-yellow-400/80 shadow-2xl hover:-translate-y-1.5'
                  }`}
                >
                  <div className="text-7xl sm:text-8xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {opt.emoji}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black mb-1.5 text-white group-hover:text-yellow-200 transition-colors">
                    {opt.title}
                  </h3>
                  <p className="text-sm text-blue-100/70 font-medium">
                    {opt.subText}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs sm:text-sm font-bold text-yellow-300 group-hover:bg-yellow-400 group-hover:text-slate-950 transition-colors">
                    <span>이 문으로 들어가기</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Kami Cheering Pop-up */}
          {showKamiCheer && (
            <div className="p-4 rounded-2xl bg-[#1e293b]/95 border-2 border-yellow-400 backdrop-blur-xl shadow-2xl animate-bounce">
              <div className="flex items-center justify-center gap-3 text-lg sm:text-xl font-black text-yellow-300">
                <KamibotImage className="w-12 h-12" />
                <span>“좋은 선택이야! 친구마다 좋아하는 것은 다를 수 있어.”</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Finished Mission 1 Celebration */
        <div className="w-full max-w-lg my-auto p-8 sm:p-12 rounded-[40px] bg-[#1e293b]/95 border border-white/15 backdrop-blur-xl shadow-2xl text-center space-y-6 animate-fadeIn">
          <div className="flex justify-center">
            <KamibotImage className="w-20 h-20" />
          </div>

          <div className="space-y-3">
            <div className="inline-block px-4 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-bold border border-yellow-400/40">
              선택빛 1단계 회복! (33%)
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-yellow-400">
              첫 번째 마음빛 발견!
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-blue-100 pt-1">
              “내 마음은 내가 살펴봐요.”
            </p>
            <p className="text-sm text-slate-300">
              내가 무엇을 좋아하는지 스스로 생각하고 정해 보았어요!
            </p>
          </div>

          <button
            onClick={() => {
              sound.playRobotBeep();
              onComplete();
            }}
            className="w-full py-5 px-8 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xl sm:text-2xl flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(250,204,21,0.45)] transition active:scale-95 border-2 border-yellow-200"
          >
            <span>다음 임무로</span>
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </button>
        </div>
      )}
    </div>
  );
};
