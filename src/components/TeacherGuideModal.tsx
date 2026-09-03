import React from 'react';
import { X, BookOpen, Clock, HelpCircle, CheckCircle2, Sparkles } from 'lucide-react';

interface TeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border-2 border-blue-500/40 rounded-2xl shadow-2xl p-5 sm:p-7 text-white font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/30 text-blue-300 border border-blue-400/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">교사용 수업 진행 안내</h2>
              <p className="text-xs text-blue-300 font-medium">카미봇 연계 1차시 도입 활동 가이드</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-200">
          {/* Quick Info Box */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400 shrink-0" />
              <div>
                <div className="text-[11px] text-slate-400">게임 소요 시간</div>
                <div className="text-xs sm:text-sm font-bold text-white">약 5~7분</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-[11px] text-slate-400">연계 도서</div>
                <div className="text-xs sm:text-sm font-bold text-white">《인공지능이 뽑은 반장》</div>
              </div>
            </div>
          </div>

          {/* Educational Objective */}
          <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40 space-y-2">
            <h3 className="text-sm font-bold text-blue-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              1차시 핵심 교육 목표
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
              <li>친구마다 좋아하는 것과 생각이 다르다는 다양성 경험하기</li>
              <li>인공지능은 정보를 바탕으로 추천하지만 언제나 정답은 아니라는 점 알기</li>
              <li>친구를 겉모습이나 단편적인 정보 하나만으로 단정하지 않기</li>
              <li><strong>“인공지능은 도와주고, 마지막 선택은 내가 해요!”</strong> 실천하기</li>
            </ul>
          </div>

          {/* Discussion Questions */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-bold text-yellow-300 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-yellow-400" />
              게임 활동 후 교사 질문 (발문 추천)
            </h3>
            <div className="space-y-2">
              {[
                {
                  num: '질문 1',
                  q: '“추천이는 왜 모든 것을 정확히 알지 못했을까요?”',
                  tip: 'AI는 사람이 입력한 데이터(정보)가 부족하면 잘못 추천할 수 있음을 짚어줍니다.',
                },
                {
                  num: '질문 2',
                  q: '“친구의 겉모습만 보고 잘하는 것을 정해도 될까요?”',
                  tip: '안경, 키, 좋아하는 색 등 한 가지 정보로 단정 짓지 않아야 함을 나눕니다.',
                },
                {
                  num: '질문 3',
                  q: '“카미가 갈 길은 누가 생각하고 정했나요?”',
                  tip: '로봇은 명령대로 움직이지만, 방향을 고민하고 결정한 것은 어린이 자신임을 깨닫습니다.',
                },
                {
                  num: '질문 4',
                  q: '“인공지능의 추천을 받은 뒤 마지막 선택은 누가 해야 할까요?”',
                  tip: '오늘의 핵심 문장(“인공지능은 도와주고, 마지막 선택은 내가 해요!”)을 다 함께 복습합니다.',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/80">
                  <div className="text-xs font-bold text-yellow-400 mb-0.5">{item.num}</div>
                  <div className="text-sm font-semibold text-white mb-1">{item.q}</div>
                  <div className="text-xs text-slate-400 leading-normal">💡 지도 팁: {item.tip}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition active:scale-95 shadow-md"
          >
            창 닫고 게임 계속하기
          </button>
        </div>
      </div>
    </div>
  );
};
