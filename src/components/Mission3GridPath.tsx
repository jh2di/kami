import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp, RotateCcw, RotateCw, Square, Heart, ArrowRight, Volume2, Sparkles, Navigation, Compass } from 'lucide-react';
import { sound, speakKorean } from '../utils/sound';
import { GridPos, KamiDirection } from '../types';
import { KamibotImage } from './KamibotImage';

interface Mission3GridPathProps {
  onComplete: () => void;
  kamiPos: GridPos;
  kamiDir: KamiDirection;
  onUpdateKami: (pos: GridPos, dir: KamiDirection, chestLit: boolean) => void;
}

export const Mission3GridPath: React.FC<Mission3GridPathProps> = ({
  onComplete,
  kamiPos,
  kamiDir,
  onUpdateKami,
}) => {
  const [hintMessage, setHintMessage] = useState<string>(
    '카미가 노란색 선택빛 보석까지 갈 수 있게 리모컨 단추를 눌러주세요!'
  );
  const [isGoalReached, setIsGoalReached] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  // Valid path coordinates on the 3x3 grid:
  // Start: (0, 0)
  // Forward along column 0: (0, 1), (0, 2)
  // Turn right along row 2: (1, 2), (2, 2) [Goal]
  const isValidPath = (x: number, z: number) => {
    return (
      (x === 0 && (z === 0 || z === 1 || z === 2)) ||
      (z === 2 && (x === 1 || x === 2))
    );
  };

  // Direction display label & arrow
  const getDirectionInfo = (dir: KamiDirection) => {
    switch (dir) {
      case 'UP':
        return { label: '앞쪽 (북쪽)', arrow: '⬆️' };
      case 'RIGHT':
        return { label: '오른쪽 (동쪽)', arrow: '➡️' };
      case 'DOWN':
        return { label: '뒤쪽 (남쪽)', arrow: '⬇️' };
      case 'LEFT':
        return { label: '왼쪽 (서쪽)', arrow: '⬅️' };
    }
  };

  // Dynamic intelligent teacher guide prompt
  const getContextGuide = () => {
    if (kamiPos.x === 0 && kamiPos.z === 0) {
      return kamiDir === 'UP'
        ? '💡 [앞으로 1칸]을 눌러 파란 길을 따라 전진해 보세요!'
        : '💡 위쪽(북쪽)을 향하도록 회전 단추를 눌러보세요!';
    }
    if (kamiPos.x === 0 && kamiPos.z === 1) {
      return kamiDir === 'UP'
        ? '💡 좋아요! [앞으로 1칸]을 한 번 더 눌러 코너까지 가요!'
        : '💡 위쪽 방향으로 회전 후 앞으로 가요!';
    }
    if (kamiPos.x === 0 && kamiPos.z === 2) {
      return kamiDir === 'RIGHT'
        ? '💡 멋져요! 이제 노란 보석을 향해 [앞으로 1칸] 가요!'
        : '💡 코너 도착! 보석이 오른쪽에 있어요. [오른쪽 회전] 누르기!';
    }
    if (kamiPos.x === 1 && kamiPos.z === 2) {
      return kamiDir === 'RIGHT'
        ? '💡 거의 다 왔어요! [앞으로 1칸]만 더 가면 보석 획득!'
        : '💡 오른쪽으로 방향을 맞춰 앞으로 가요!';
    }
    return hintMessage;
  };

  const checkGoal = (pos: GridPos) => {
    if (pos.x === 2 && pos.z === 2) {
      setIsGoalReached(true);
      onUpdateKami(pos, kamiDir, true);
      sound.playCelebrationFanfare();
      sound.playBellChime();
      const victoryText = '세 번째 마음빛 발견! 도구는 도와주고, 올바른 방향은 사람이 결정해요.';
      speakKorean(victoryText);
    }
  };

  // Turn Left (UP -> LEFT -> DOWN -> RIGHT -> UP)
  const handleTurnLeft = useCallback(() => {
    if (isGoalReached) return;
    sound.playRobotBeep();
    const dirs: KamiDirection[] = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
    const currentIdx = dirs.indexOf(kamiDir);
    const nextDir = dirs[(currentIdx + 3) % 4];
    onUpdateKami(kamiPos, nextDir, false);
    setHintMessage('카미가 왼쪽으로 방향을 돌렸어요!');
  }, [kamiDir, kamiPos, isGoalReached, onUpdateKami]);

  // Turn Right (UP -> RIGHT -> DOWN -> LEFT -> UP)
  const handleTurnRight = useCallback(() => {
    if (isGoalReached) return;
    sound.playRobotBeep();
    const dirs: KamiDirection[] = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
    const currentIdx = dirs.indexOf(kamiDir);
    const nextDir = dirs[(currentIdx + 1) % 4];
    onUpdateKami(kamiPos, nextDir, false);
    setHintMessage('카미가 오른쪽으로 방향을 돌렸어요!');
  }, [kamiDir, kamiPos, isGoalReached, onUpdateKami]);

  // Move Forward 1 step
  const handleMoveForward = useCallback(() => {
    if (isGoalReached) return;
    sound.playStepSound();
    let nextX = kamiPos.x;
    let nextZ = kamiPos.z;

    if (kamiDir === 'UP') nextZ += 1;
    else if (kamiDir === 'RIGHT') nextX += 1;
    else if (kamiDir === 'DOWN') nextZ -= 1;
    else if (kamiDir === 'LEFT') nextX -= 1;

    // Check bounds: 0 to 2
    if (nextX < 0 || nextX > 2 || nextZ < 0 || nextZ > 2) {
      sound.playRobotBeep();
      setHintMessage('길의 끝이에요. 괜찮아요! 회전 단추를 눌러 길을 찾아봐요.');
      speakKorean('길의 끝이에요. 회전 단추를 눌러 방향을 바꿔봐요.');
      return;
    }

    // Check path
    if (!isValidPath(nextX, nextZ)) {
      sound.playRobotBeep();
      setHintMessage('풀밭이에요! 회전 단추를 눌러 파란색 길로 가요.');
      speakKorean('파란색 길로 가도록 방향을 돌려봐요.');
      return;
    }

    // Valid forward move
    const newPos = { x: nextX, z: nextZ };
    setStepCount((c) => c + 1);
    onUpdateKami(newPos, kamiDir, newPos.x === 2 && newPos.z === 2);

    if (newPos.x === 2 && newPos.z === 2) {
      checkGoal(newPos);
    } else {
      sound.playBellChime();
      setHintMessage('좋아요! 앞으로 한 걸음 씩씩하게 나아갔어요.');
    }
  }, [kamiDir, kamiPos, isGoalReached, onUpdateKami]);

  // Stop / pause button
  const handleStop = useCallback(() => {
    sound.playRobotBeep();
    setHintMessage('카미가 멈춰서 다음 안내를 기다리고 있어요.');
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGoalReached) return;
      if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        handleMoveForward();
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault();
        handleTurnLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        e.preventDefault();
        handleTurnRight();
      } else if (e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        handleStop();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMoveForward, handleTurnLeft, handleTurnRight, handleStop, isGoalReached]);

  const dirInfo = getDirectionInfo(kamiDir);

  return (
    <div className="relative z-10 flex flex-col items-center justify-between min-h-[calc(100vh-64px)] mt-16 px-3 sm:px-4 py-2 sm:py-3 pointer-events-none select-none">
      {/* Top Bar with Stage, Direction Compass & Helper Mini-Map (pointer-events-auto) */}
      <div className="flex flex-wrap items-center justify-between w-full max-w-3xl px-3 sm:px-5 py-2 rounded-full bg-[#1e293b]/90 border border-white/15 backdrop-blur-md gap-2 shadow-xl pointer-events-auto">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-yellow-400" />
          <span className="text-xs sm:text-sm font-black text-yellow-300">
            임무 3: 카미 길 안내하기
          </span>
        </div>

        {/* Direction Compass Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-400/40 text-blue-200 text-xs font-bold">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>카미 방향:</span>
          <span className="text-yellow-300 font-black">{dirInfo.arrow} {dirInfo.label}</span>
        </div>

        {/* 3x3 Mini Guide Map with Orientation Arrows */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-300 font-bold">지도:</span>
          <div className="grid grid-cols-3 gap-1 p-1 bg-black/60 rounded-xl border border-white/10 shadow-inner">
            {[2, 1, 0].map((rowZ) =>
              [0, 1, 2].map((colX) => {
                const isPath = isValidPath(colX, rowZ);
                const isCurrent = kamiPos.x === colX && kamiPos.z === rowZ;
                const isDestination = colX === 2 && rowZ === 2;

                return (
                  <div
                    key={`${colX}-${rowZ}`}
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-blue-400 text-slate-950 ring-2 ring-yellow-300 shadow-[0_0_8px_#38bdf8]'
                        : isDestination
                        ? 'bg-yellow-400 text-slate-950 shadow-[0_0_8px_#facc15]'
                        : isPath
                        ? 'bg-blue-600/70'
                        : 'bg-white/5'
                    }`}
                  >
                    {isCurrent ? dirInfo.arrow : isDestination ? '★' : ''}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 3D PLAYING FIELD AREA (Elevated & 100% Unobstructed for Tablets) */}
      <div className="flex-1 w-full" />

      {!isGoalReached ? (
        /* Tablet-Optimized Bottom-Docked Remote Controller */
        <div className="w-full max-w-xl mt-auto pb-1 sm:pb-2 space-y-1.5 pointer-events-auto">
          {/* Smart Guide Speech Bubble */}
          <div className="px-4 py-2 rounded-2xl bg-[#1e293b]/90 border border-white/15 backdrop-blur-md shadow-lg flex items-center justify-between gap-2">
            <p className="text-xs sm:text-sm font-bold text-white truncate break-keep text-left flex-1">
              <span className="text-yellow-400 mr-1.5">💬</span>
              {getContextGuide()}
            </p>
            <button
              onClick={() => setIsMinimized((v) => !v)}
              className="text-[11px] font-bold text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-white/10 shrink-0 transition-colors"
            >
              {isMinimized ? '조종기 펴기 ▲' : '조종기 접기 ▼'}
            </button>
          </div>

          {!isMinimized && (
            <div className="bg-[#1e293b]/95 border-2 border-white/20 rounded-3xl p-3 sm:p-4 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)] space-y-2 animate-fadeIn">
              {/* Tablet Touch D-Pad Layout */}
              <div className="flex items-stretch justify-center gap-2 sm:gap-3">
                {/* Turn Left Button */}
                <button
                  onClick={handleTurnLeft}
                  className="flex-1 min-h-[58px] sm:min-h-[64px] py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex flex-col items-center justify-center gap-1 font-bold border border-white/15 active:scale-95 transition-all shadow-md touch-manipulation"
                >
                  <RotateCcw className="w-5 h-5 text-cyan-300 stroke-[2.5]" />
                  <span className="text-xs sm:text-sm font-black">왼쪽 회전</span>
                  <span className="text-[10px] text-slate-400 font-mono">← / A</span>
                </button>

                {/* Move Forward Hero Button (Vibrant Yellow, High Contrast, Large Touch Target) */}
                <button
                  onClick={handleMoveForward}
                  className="flex-[1.5] min-h-[58px] sm:min-h-[64px] py-2.5 px-4 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 hover:brightness-110 text-slate-950 rounded-2xl flex flex-col items-center justify-center gap-0.5 font-black shadow-[0_0_25px_rgba(250,204,21,0.5)] active:scale-95 transition-all border-2 border-yellow-100 touch-manipulation"
                >
                  <ArrowUp className="w-7 h-7 stroke-[3.5] text-slate-950" />
                  <span className="text-sm sm:text-base font-black tracking-tight">앞으로 1칸</span>
                  <span className="text-[10px] text-slate-900/80 font-mono font-bold">↑ / W</span>
                </button>

                {/* Turn Right Button */}
                <button
                  onClick={handleTurnRight}
                  className="flex-1 min-h-[58px] sm:min-h-[64px] py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex flex-col items-center justify-center gap-1 font-bold border border-white/15 active:scale-95 transition-all shadow-md touch-manipulation"
                >
                  <RotateCw className="w-5 h-5 text-cyan-300 stroke-[2.5]" />
                  <span className="text-xs sm:text-sm font-black">오른쪽 회전</span>
                  <span className="text-[10px] text-slate-400 font-mono">→ / D</span>
                </button>

                {/* Stop Button */}
                <button
                  onClick={handleStop}
                  className="w-14 sm:w-16 min-h-[58px] sm:min-h-[64px] py-2 bg-black/50 hover:bg-black/70 text-slate-300 rounded-2xl flex flex-col items-center justify-center gap-1 font-bold border border-white/10 active:scale-95 transition-all touch-manipulation"
                >
                  <Square className="w-4 h-4 fill-slate-300 stroke-none" />
                  <span className="text-[10px] font-bold">멈춤</span>
                  <span className="text-[9px] text-slate-500 font-mono">Space</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Goal Arrived & Mission 3 Celebration Modal */
        <div className="w-full max-w-lg my-auto p-6 sm:p-8 rounded-[40px] bg-[#1e293b]/95 border-2 border-yellow-400/80 backdrop-blur-xl shadow-2xl text-center space-y-4 animate-fadeIn pointer-events-auto">
          {/* Kamibot Image */}
          <div className="flex justify-center">
            <KamibotImage className="w-20 h-20" />
          </div>

          {/* Dialogue */}
          <div className="p-4 rounded-2xl bg-blue-950/70 border border-blue-400/40 text-blue-100 text-sm sm:text-base leading-relaxed font-bold">
            “나는 명령대로 움직이는 로봇이지만, 어느 길로 갈지는 <strong className="text-yellow-300">마음빛 탐험대원</strong>이 생각하고 결정해 주었어!”
          </div>

          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-bold border border-yellow-400/40">
              세 번째 임무 완료! 선택빛 획득 (100%)
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-yellow-400">
              세 번째 마음빛 발견!
            </h2>
            <p className="text-lg sm:text-xl font-bold text-blue-100 pt-1">
              “도구는 도와주고, 방향은 사람이 결정해요.”
            </p>
            <p className="text-xs sm:text-sm text-slate-300">
              기계와 인공지능은 일을 돕는 도구이고, 올바른 방향을 선택하는 주인공은 바로 우리 탐험대원이에요!
            </p>
          </div>

          <button
            onClick={() => {
              sound.playRobotBeep();
              onComplete();
            }}
            className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-lg sm:text-xl flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(250,204,21,0.5)] transition active:scale-95 border-2 border-yellow-200"
          >
            <Sparkles className="w-5 h-5 fill-slate-950 stroke-none" />
            <span>선택빛 되찾기 (마을로 복귀)</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      )}
    </div>
  );
};
