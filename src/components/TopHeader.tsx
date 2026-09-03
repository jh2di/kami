import React, { useState } from 'react';
import { Volume2, VolumeX, Maximize, Minimize, HelpCircle, Heart } from 'lucide-react';
import { sound } from '../utils/sound';
import { GameStage } from '../types';

interface TopHeaderProps {
  stage: GameStage;
  lightsLit: number;
  onOpenTeacherGuide: () => void;
  playerName: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  stage,
  lightsLit,
  onOpenTeacherGuide,
  playerName,
}) => {
  const [sfxOn, setSfxOn] = useState(true);
  const [bgmOn, setBgmOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleSfx = () => {
    const state = sound.toggleSfx();
    setSfxOn(state);
    if (state) sound.playRobotBeep();
  };

  const toggleBgm = () => {
    const state = sound.toggleBgm();
    setBgmOn(state);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-3 sm:px-8 py-2.5 sm:py-3.5 bg-white/5 backdrop-blur-xl border-b border-white/10 text-white select-none">
      {/* Left: Brand & Stage Badge */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        <div className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-yellow-400 via-amber-300 to-yellow-500 text-slate-950 shadow-[0_0_20px_rgba(250,204,21,0.4)]">
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-950 stroke-none heart-glow" />
        </div>
        <div>
          <h1 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-300">
              마음빛 탐험대
            </span>
            {playerName && (
              <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold border border-blue-400/30">
                탐험대원: <strong className="text-white">{playerName}</strong>
              </span>
            )}
          </h1>
          <p className="text-[10px] sm:text-xs text-yellow-100/60 uppercase tracking-[0.2em] font-light">
            사라진 선택빛
          </p>
        </div>
      </div>

      {/* Center: Energy Value & Choice Light Indicators (Immersive UI pattern) */}
      <div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-1.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((num) => {
            const isLit = lightsLit >= num || stage === 'RESTORATION' || stage === 'CEREMONY';
            return (
              <div
                key={num}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-sm font-black transition-all duration-500 ${
                  isLit
                    ? 'bg-yellow-400 text-slate-950 ring-2 ring-yellow-300 shadow-[0_0_15px_#facc15]'
                    : 'bg-white/10 text-slate-400 border border-white/10'
                }`}
              >
                {isLit ? '💛' : '⚪'}
              </div>
            );
          })}
        </div>

        <div className="h-6 w-[1px] bg-white/20 hidden sm:block"></div>

        <div className="text-yellow-400 font-bold text-xs sm:text-sm tracking-wide">
          선택빛 에너지:{' '}
          <span className="text-white font-extrabold text-sm sm:text-base">
            {stage === 'RESTORATION' || stage === 'CEREMONY' || lightsLit >= 3
              ? '100'
              : lightsLit === 2
              ? '66'
              : lightsLit === 1
              ? '33'
              : '0'}
            %
          </span>
        </div>
      </div>

      {/* Right: Sound, Fullscreen, Teacher Guide */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Teacher Guide Button */}
        <button
          onClick={onOpenTeacherGuide}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-blue-200 border border-white/15 text-xs font-semibold transition-all active:scale-95 shadow-sm"
          title="교사용 안내"
        >
          <HelpCircle className="w-4 h-4 text-blue-300" />
          <span className="hidden sm:inline">교사용 안내</span>
        </button>

        {/* SFX Button */}
        <button
          onClick={toggleSfx}
          className={`p-2 rounded-xl border text-xs transition-all active:scale-95 ${
            sfxOn
              ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40 hover:bg-yellow-400/30'
              : 'bg-white/5 text-slate-400 border-white/10'
          }`}
          title={sfxOn ? '효과음 켜짐' : '효과음 꺼짐'}
        >
          {sfxOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 text-xs transition-all active:scale-95 hidden sm:flex"
          title="전체 화면 전환"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
