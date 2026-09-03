import React, { useState } from 'react';
import { Sparkles, Heart, ArrowRight, Volume2, HelpCircle, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { sound, speakKorean } from '../utils/sound';
import { JudgmentType, Mission2Question } from '../types';
import { KamibotImage } from './KamibotImage';

interface Mission2InspectProps {
  onComplete: () => void;
}

export const Mission2Inspect: React.FC<Mission2InspectProps> = ({ onComplete }) => {
  const [qIndex, setQIndex] = useState(0);
  const [selectedJudgment, setSelectedJudgment] = useState<JudgmentType | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string; subHint?: string } | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const questions: Mission2Question[] = [
    {
      id: 1,
      speaker: '인공지능 추천이',
      targetFriend: '민수',
      friendTrait: '파란색을 좋아함',
      aiAssumption: '축구도 무조건 좋아할 거야!',
      statement: '“민수는 파란색을 좋아해요. 그러니까 민수는 축구도 좋아할 거예요!”',
      correctJudgments: ['NEED_MORE_INFO', 'SHOULD_NOT'],
      explanation: '훌륭한 생각이에요! 좋아하는 색 하나만 보고 좋아하는 놀이를 마음대로 정하면 안 돼요. 친구에게 직접 물어보고 더 알아보는 자세가 필요해요!',
    },
    {
      id: 2,
      speaker: '인공지능 추천이',
      targetFriend: '지우',
      friendTrait: '안경을 썼음',
      aiAssumption: '책 읽기만 좋아할 거야!',
      statement: '“지우는 안경을 썼어요. 그러니까 책 읽기만 좋아할 거예요!”',
      correctJudgments: ['NEED_MORE_INFO', 'SHOULD_NOT'],
      explanation: '정확한 판단이에요! 안경을 썼다는 겉모습 하나만으로 친구의 취미를 단정하면 편견이 생겨요. 지우의 진짜 생각을 더 살펴보아야 해요!',
    },
    {
      id: 3,
      speaker: '인공지능 추천이',
      targetFriend: '서준이',
      friendTrait: '키가 큼',
      aiAssumption: '달리기를 제일 잘할 거야!',
      statement: '“서준이는 키가 커요. 그러니까 달리기를 가장 잘할 거예요!”',
      correctJudgments: ['NEED_MORE_INFO', 'SHOULD_NOT'],
      explanation: '아주 멋져요! 키만 보고 실력을 단정할 수 없어요. 열심히 연습한 노력과 실제 실력 등 더 많은 정보와 사람의 마음을 살펴봐야 해요!',
    },
  ];

  const currentQ = questions[qIndex];

  const judgments = [
    {
      type: 'MAYBE' as JudgmentType,
      symbol: '⭕',
      title: '그럴 수도 있어요',
      subtitle: '하지만 단정은 위험해요',
      color: 'bg-emerald-600/20 hover:bg-emerald-600/40 border-emerald-400/40 text-emerald-100',
    },
    {
      type: 'NEED_MORE_INFO' as JudgmentType,
      symbol: '🔺',
      title: '정보가 더 필요해요',
      subtitle: '직접 물어보고 더 알아봐요',
      color: 'bg-amber-600/20 hover:bg-amber-600/40 border-amber-400/40 text-amber-100',
      isRecommended: true,
    },
    {
      type: 'SHOULD_NOT' as JudgmentType,
      symbol: '❌',
      title: '그렇게 정하면 안 돼요',
      subtitle: '한 가지로 사람을 판단 금지',
      color: 'bg-rose-600/20 hover:bg-rose-600/40 border-rose-400/40 text-rose-100',
      isRecommended: true,
    },
  ];

  const handleSelectJudgment = (type: JudgmentType) => {
    setSelectedJudgment(type);
    const isCorrect = currentQ.correctJudgments.includes(type);

    if (isCorrect) {
      sound.playBellChime();
      sound.playRobotBeep();
      setFeedback({
        isCorrect: true,
        message: currentQ.explanation,
        subHint: '인공지능의 추천을 맹신하지 않고, 친구의 마음과 여러 정보를 고르게 살피는 멋진 대원이에요!',
      });
      speakKorean(`정답이에요! ${currentQ.explanation}`);
    } else {
      // MAYBE selected
      sound.playRobotBeep();
      const maybeHint =
        qIndex === 0
          ? '민수가 축구를 좋아할 수도 있어요! 하지만 "파란색을 좋아하니 축구도 좋아할 것"이라고 인공지능이 섣불리 단정해버리면 편견이 생겨요.'
          : qIndex === 1
          ? '지우가 책 읽기를 좋아할 수도 있어요! 하지만 안경을 썼다고 해서 "책만 좋아할 것"이라고 겉모습으로 사람을 정하면 안 돼요.'
          : '키가 크면 잘 달릴 수도 있어요! 하지만 겉모습 하나만 보고 친구의 실력을 단정하면 안 돼요.';
      setFeedback({
        isCorrect: false,
        message: maybeHint,
        subHint: '친구의 진짜 생각을 알려면 무엇이 더 필요할까요? 🔺"정보가 더 필요해요"나 ❌"그렇게 정하면 안 돼요"를 생각해 보세요!',
      });
      speakKorean(`${maybeHint} 친구를 더 잘 알려면 무엇이 필요할지 다시 골라보세요.`);
    }
  };

  const handleNextQuestion = () => {
    sound.playRobotBeep();
    setFeedback(null);
    setSelectedJudgment(null);

    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      setIsFinished(true);
      sound.playCelebrationFanfare();
      speakKorean('두 번째 마음빛 발견! 한 가지 정보만 보고 사람을 판단하지 않아요.');
    }
  };

  const handleRetry = () => {
    sound.playRobotBeep();
    setFeedback(null);
    setSelectedJudgment(null);
  };

  const handleReadStatement = () => {
    speakKorean(`추천이가 말해요. ${currentQ.statement}`);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-between min-h-[calc(100vh-64px)] mt-16 px-4 py-4 pointer-events-auto">
      {/* Top Tracker - Compact */}
      <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <span className="text-xs sm:text-sm font-black text-yellow-300">
          임무 2: 추천이 점검하기 ({qIndex + 1}/3)
        </span>
        <div className="flex gap-2">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx < qIndex || isFinished
                  ? 'bg-yellow-400 ring-2 ring-yellow-300 shadow-[0_0_8px_#facc15]'
                  : idx === qIndex
                  ? 'bg-blue-400 animate-pulse'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {!isFinished ? (
        <div className="w-full max-w-2xl flex flex-col justify-between flex-1 py-2 space-y-3">
          {/* AI Chucheon-i Card - Streamlined to keep 3D view open */}
          <div className="relative bg-[#1e293b]/85 border border-blue-400/30 rounded-3xl p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-3">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Glowing Robot Avatar */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-400/50 shadow-[0_0_15px_rgba(96,165,250,0.4)] shrink-0">
                <span className="text-2xl sm:text-3xl">🤖</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-blue-300 text-xs font-bold uppercase tracking-wider">
                    인공지능 추천이의 분석
                  </span>
                  <button
                    onClick={handleReadStatement}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-cyan-200 text-xs font-semibold transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>소리 듣기</span>
                  </button>
                </div>
                <p className="text-base sm:text-xl font-black text-white leading-snug break-keep mt-1">
                  {currentQ.statement}
                </p>
              </div>
            </div>

            {/* Analysis details badge */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200">
                알고 있는 정보: <strong className="text-yellow-300">{currentQ.friendTrait}</strong>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200">
                추천이의 단정: <strong>{currentQ.aiAssumption}</strong>
              </span>
            </div>
          </div>

          {/* Center 3D viewport area remains open here! */}

          {/* 3 Choice Buttons: ⭕ / 🔺 / ❌ */}
          {!feedback ? (
            <div className="space-y-2 mt-auto">
              <div className="text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-200 text-xs sm:text-sm font-black shadow-sm">
                  💡 추천이의 단정(말)이 올바른 생각일까요?
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {judgments.map((j) => {
                  const isSelected = selectedJudgment === j.type;
                  return (
                    <button
                      key={j.type}
                      onClick={() => handleSelectJudgment(j.type)}
                      className={`p-3 sm:p-4 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 backdrop-blur-md shadow-lg ${
                        isSelected
                          ? 'bg-yellow-400 text-slate-950 border-yellow-300 ring-4 ring-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.5)] scale-105'
                          : `${j.color}`
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl">{j.symbol}</span>
                      <span className="text-xs sm:text-sm font-black text-center break-keep leading-tight">
                        {j.title}
                      </span>
                      <span className="text-[10px] sm:text-[11px] opacity-80 text-center break-keep hidden sm:block">
                        {j.subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : feedback.isCorrect ? (
            /* Correct Feedback Card */
            <div className="p-5 sm:p-6 rounded-3xl bg-[#1e293b]/95 border-2 border-emerald-400/70 backdrop-blur-xl shadow-2xl text-center space-y-3 animate-fadeIn mt-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs sm:text-sm font-bold border border-emerald-400/30">
                <Check className="w-4 h-4" />
                <span>정확한 판단이에요! (정답)</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-white leading-relaxed break-keep">
                {feedback.message}
              </p>
              {feedback.subHint && (
                <p className="text-xs text-blue-200/90 font-medium">
                  {feedback.subHint}
                </p>
              )}
              <button
                onClick={handleNextQuestion}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-base flex items-center justify-center gap-2 mx-auto shadow-[0_0_20px_rgba(250,204,21,0.4)] transition active:scale-95 border border-yellow-200"
              >
                <span>{qIndex < questions.length - 1 ? '다음 문제로' : '임무 완료하기'}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          ) : (
            /* Try Again Friendly Guidance Card */
            <div className="p-5 sm:p-6 rounded-3xl bg-[#1e293b]/95 border-2 border-amber-400/70 backdrop-blur-xl shadow-2xl text-center space-y-3 animate-fadeIn mt-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs sm:text-sm font-bold border border-amber-400/30">
                <AlertCircle className="w-4 h-4" />
                <span>한 걸음 더 생각해 볼까요?</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-yellow-100 leading-relaxed break-keep">
                {feedback.message}
              </p>
              {feedback.subHint && (
                <p className="text-xs text-amber-200/90 font-medium bg-white/5 p-2 rounded-xl border border-white/10">
                  💡 {feedback.subHint}
                </p>
              )}
              <button
                onClick={handleRetry}
                className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 mx-auto shadow-md transition active:scale-95 border border-amber-200"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>다시 골라보기</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Finished Mission 2 Celebration */
        <div className="w-full max-w-lg my-auto p-6 sm:p-8 rounded-[36px] bg-[#1e293b]/95 border border-white/15 backdrop-blur-xl shadow-2xl text-center space-y-5 animate-fadeIn">
          <div className="flex justify-center">
            <KamibotImage className="w-20 h-20" />
          </div>

          {/* Chucheon-i Appreciative Message */}
          <div className="p-4 rounded-2xl bg-blue-950/70 border border-blue-400/40 text-blue-100 text-sm leading-relaxed font-medium">
            <span className="text-xl">💙</span>
            <br />
            “고마워요! 내가 가진 정보가 너무 적었어요. 다음에는 사람의 마음과 더 많은 정보를 살펴볼게요.”
          </div>

          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-bold border border-yellow-400/40">
              선택빛 2단계 회복! (66%)
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-yellow-400">
              두 번째 마음빛 발견!
            </h2>
            <p className="text-lg sm:text-xl font-bold text-blue-100">
              “한 가지 정보만 보고 사람을 판단하지 않아요.”
            </p>
            <p className="text-xs sm:text-sm text-slate-300">
              친구의 겉모습이나 단편적인 정보에 얽매이지 않고 넓게 바라보았어요!
            </p>
          </div>

          <button
            onClick={() => {
              sound.playRobotBeep();
              onComplete();
            }}
            className="w-full py-4 px-6 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-lg flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(250,204,21,0.45)] transition active:scale-95 border-2 border-yellow-200"
          >
            <span>다음 임무로</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      )}
    </div>
  );
};
