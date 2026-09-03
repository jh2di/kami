import React, { useState, useEffect, useRef } from 'react';
import { Award, Heart, Printer, Maximize, RotateCcw, Volume2, Sparkles, X, Download, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound, speakKorean } from '../utils/sound';
import { KamibotImage } from './KamibotImage';

interface CeremonyScreenProps {
  playerName: string;
  onRestart: () => void;
}

export const CeremonyScreen: React.FC<CeremonyScreenProps> = ({ playerName, onRestart }) => {
  const [showLargeCert, setShowLargeCert] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const displayName = playerName.trim() || '용감한 탐험대원';

  useEffect(() => {
    sound.playCelebrationFanfare();

    // Spectacular multi-tier fireworks & confetti burst
    const end = Date.now() + 3.5 * 1000;
    const interval: NodeJS.Timeout = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      // Left burst
      confetti({
        particleCount: 25,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.7 },
        colors: ['#ffd700', '#f59e0b', '#00e5ff', '#38bdf8', '#f43f5e', '#ffffff'],
      });
      // Right burst
      confetti({
        particleCount: 25,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.7 },
        colors: ['#ffd700', '#f59e0b', '#00e5ff', '#38bdf8', '#f43f5e', '#ffffff'],
      });
    }, 250);

    const victoryNarration = `축하합니다! ${displayName} 대원을 공식 마음빛 탐험대원으로 임명합니다! 인공지능은 도와주고, 올바른 방향을 선택하는 주인공은 바로 우리 탐험대원이에요!`;
    speakKorean(victoryNarration);

    return () => clearInterval(interval);
  }, [displayName]);

  // Print Certificate
  const handlePrintCertificate = () => {
    sound.playBellChime();
    window.print();
  };

  // Save certificate as high-resolution PNG image with Gold Seal & Kamibot
  const handleSaveImage = () => {
    sound.playBellChime();
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 840;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Rich Dark Royal Navy Background
    const bgGrad = ctx.createRadialGradient(600, 420, 50, 600, 420, 650);
    bgGrad.addColorStop(0, '#1e293b');
    bgGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ornate Gold Metallic Outer Border
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 14;
    ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

    // Thin Inner Gold Accent Border
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.strokeRect(52, 52, canvas.width - 104, canvas.height - 104);

    // Corner Ornaments
    const cornerSize = 28;
    const corners = [
      [52, 52],
      [canvas.width - 52 - cornerSize, 52],
      [52, canvas.height - 52 - cornerSize],
      [canvas.width - 52 - cornerSize, canvas.height - 52 - cornerSize],
    ];
    ctx.fillStyle = '#facc15';
    corners.forEach(([cx, cy]) => {
      ctx.fillRect(cx, cy, cornerSize, cornerSize);
    });

    // Header Stars
    ctx.fillStyle = '#fbbf24';
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★  ★  ★  마 음 빛  탐 험 대  공 식  임 명  ★  ★  ★', canvas.width / 2, 110);

    // Main Title: 마음빛 탐험대원 임명장
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 54px sans-serif';
    ctx.fillText('마음빛 탐험대원 임명장', canvas.width / 2, 180);

    // Decorative dividing line with center diamond
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(250, 215);
    ctx.lineTo(950, 215);
    ctx.stroke();

    // Player / Explorer Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px sans-serif';
    ctx.fillText(`공식 탐험대원: ${displayName}`, canvas.width / 2, 285);

    // Proclamation Text
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '24px sans-serif';
    ctx.fillText(
      '위 대원은 인공지능의 추천을 맹목적으로 따르지 않고, 친구의 마음을 깊이 헤아리며,',
      canvas.width / 2,
      365
    );
    ctx.fillText(
      '스스로 올바른 길을 판단하고 안내하는 세 가지 마음빛 탐험 임무를 훌륭히 마쳤습니다.',
      canvas.width / 2,
      415
    );
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(
      '이에 마음빛 마을의 자랑스러운 공식 『마음빛 탐험대원』으로 당당히 임명합니다.',
      canvas.width / 2,
      475
    );

    // Slogan Banner
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(200, 530, 800, 70);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(200, 530, 800, 70);

    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('“도구는 도와주고, 올바른 방향은 사람이 결정해요!”', canvas.width / 2, 575);

    // Royal Golden Seal (Bottom Left)
    const sealX = 300;
    const sealY = 710;
    ctx.save();
    ctx.beginPath();
    ctx.arc(sealX, sealY, 52, 0, Math.PI * 2);
    ctx.fillStyle = '#d97706';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#fef08a';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('마음빛 탐험대', sealX, sealY - 12);
    ctx.fillText('★ 공식 인장 ★', sealX, sealY + 12);
    ctx.fillText('KAMIBOT', sealX, sealY + 30);
    ctx.restore();

    // Date & Organization (Bottom Right)
    const today = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px sans-serif';
    ctx.fillText(today, 620, 690);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('마음빛 탐험대 본부 & 파트너 카미', 620, 735);

    // Trigger download
    const link = document.createElement('a');
    link.download = `마음빛탐험대원_임명장_${displayName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-between min-h-[calc(100vh-64px)] mt-16 px-4 py-5 pointer-events-auto select-none">
      {/* Celebration Header */}
      <div className="text-center space-y-2 animate-fadeIn">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-yellow-400/20 border-2 border-yellow-400 text-yellow-300 text-xs sm:text-sm font-black shadow-[0_0_25px_rgba(250,204,21,0.5)] backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
          <span>축하합니다! 마음빛 탐험 완주 (100%)</span>
          <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
          축하합니다! 공식 <span className="text-yellow-300">마음빛 탐험대원</span> 탄생!
        </h1>
      </div>

      {/* Magnificent Royal Certificate Card */}
      <div
        ref={certRef}
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#1e293b]/95 via-[#0f172a]/95 to-[#090d16]/95 border-4 border-yellow-400/90 rounded-[44px] p-6 sm:p-10 shadow-[0_0_70px_rgba(250,204,21,0.4)] backdrop-blur-2xl text-center space-y-5 my-auto animate-fadeIn"
      >
        {/* Top Floating Golden Royal Ribbon Badge */}
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_30px_#facc15] border-2 border-yellow-100">
          <Award className="w-5 h-5 text-slate-950" />
          <span>공식 마음빛 탐험대원 임명장</span>
          <Star className="w-4 h-4 fill-slate-950 text-slate-950" />
        </div>

        {/* Certificate Header with Kamibot's Real Image */}
        <div className="pt-3 flex flex-col items-center justify-center space-y-2 border-b border-white/10 pb-4">
          <div className="relative">
            <KamibotImage className="w-20 h-20 sm:w-24 sm:h-24" />
            <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md border border-yellow-100">
              파트너 카미
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-300 tracking-tight pt-1">
            마음빛 탐험대원 임명장
          </h2>
          <div className="text-sm sm:text-base text-cyan-300 font-bold">
            공식 탐험대원:{' '}
            <span className="text-white text-lg sm:text-2xl font-black underline underline-offset-4 decoration-yellow-400">
              {displayName}
            </span>
          </div>
        </div>

        {/* Proclamation Body */}
        <div className="space-y-3 text-slate-200 leading-relaxed text-xs sm:text-sm md:text-base font-medium break-keep">
          <p>
            위 대원은 인공지능의 추천을 무조건 따르지 않고, 친구의 마음을 살피며, 스스로 생각하고 올바른 결정을 내리는 세 가지 마음빛 탐험 임무를 훌륭하게 완수하였습니다.
          </p>
          <p className="text-sm sm:text-lg font-bold text-yellow-300">
            이에 마음빛 마을의 자랑스러운 공식 <span className="text-yellow-200 underline">『마음빛 탐험대원』</span>으로 당당히 임명합니다!
          </p>
        </div>

        {/* Core Motto Box */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-yellow-400/40 text-xs sm:text-sm text-yellow-300 font-bold backdrop-blur-md shadow-inner">
          ✨ “도구는 도와주고, 방향은 사람이 결정해요!”
        </div>

        {/* Kami's Warm Speech Box */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-blue-100 font-semibold flex items-center justify-center gap-2">
          <span>🤖</span>
          <span>카미: “{displayName} 대원님, 나와 함께 바른 선택의 빛을 찾아줘서 정말 고마워요!”</span>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="w-full max-w-xl pb-4 space-y-3 pointer-events-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* View Large */}
          <button
            onClick={() => setShowLargeCert(true)}
            className="py-3 px-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1 shadow-md transition active:scale-95 border border-white/10"
          >
            <Maximize className="w-5 h-5 text-blue-400" />
            <span>임명장 크게 보기</span>
          </button>

          {/* Save image */}
          <button
            onClick={handleSaveImage}
            className="py-3 px-2 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1 shadow-md transition active:scale-95 border border-emerald-400/30"
          >
            <Download className="w-5 h-5 text-emerald-400" />
            <span>임명장 저장하기</span>
          </button>

          {/* Print */}
          <button
            onClick={handlePrintCertificate}
            className="py-3 px-2 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1 shadow-md transition active:scale-95 border border-cyan-400/30"
          >
            <Printer className="w-5 h-5 text-cyan-400" />
            <span>임명장 인쇄하기</span>
          </button>

          {/* Restart */}
          <button
            onClick={() => {
              sound.playRobotBeep();
              onRestart();
            }}
            className="py-3 px-2 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1 shadow-[0_0_20px_rgba(250,204,21,0.4)] transition active:scale-95 border-2 border-yellow-200"
          >
            <RotateCcw className="w-5 h-5 text-slate-950" />
            <span>다시 탐험하기</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Certificate Modal */}
      {showLargeCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn pointer-events-auto">
          <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#020617] border-4 border-yellow-400 rounded-[44px] p-6 sm:p-12 shadow-[0_0_80px_rgba(250,204,21,0.5)] text-center space-y-6">
            <button
              onClick={() => setShowLargeCert(false)}
              className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex justify-center">
              <KamibotImage className="w-24 h-24 sm:w-28 sm:h-28" />
            </div>

            <div className="space-y-1">
              <div className="text-yellow-400 text-xs sm:text-sm font-black tracking-widest uppercase">
                ★ 마음빛 마을 수호 공식 인증 ★
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-300">
                마음빛 탐험대원 임명장
              </h2>
            </div>

            <div className="text-xl sm:text-2xl font-bold text-white">
              공식 탐험대원: <span className="text-yellow-300 underline underline-offset-4">{displayName}</span>
            </div>

            <div className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl mx-auto space-y-3 break-keep">
              <p>
                위 대원은 인공지능의 추천을 맹목적으로 따르지 않고, 친구의 마음을 깊이 헤아리며, 스스로 생각하고 올바른 결정을 내리는 세 가지 마음빛 탐험 임무를 훌륭하게 완수하였습니다.
              </p>
              <p className="text-lg sm:text-xl font-black text-yellow-300">
                이에 마음빛 마을의 빛나는 수호자 『마음빛 탐험대원』으로 당당히 임명합니다!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-yellow-400/40 text-yellow-300 font-black text-base sm:text-lg">
              “도구는 도와주고, 올바른 방향은 사람이 결정해요!”
            </div>

            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={handleSaveImage}
                className="px-6 sm:px-8 py-3.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-sm sm:text-base flex items-center gap-2 shadow-lg transition active:scale-95 border border-yellow-200"
              >
                <Download className="w-5 h-5" />
                <span>이미지로 저장하기</span>
              </button>
              <button
                onClick={handlePrintCertificate}
                className="px-6 sm:px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base flex items-center gap-2 border border-white/20 transition active:scale-95"
              >
                <Printer className="w-5 h-5" />
                <span>인쇄하기</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
