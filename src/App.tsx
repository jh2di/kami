import React, { useState } from 'react';
import { GameStage, GridPos, KamiDirection } from './types';
import { ThreeWorld } from './components/ThreeWorld';
import { TopHeader } from './components/TopHeader';
import { TitleScreen } from './components/TitleScreen';
import { IntroCutscene } from './components/IntroCutscene';
import { Mission1Choice } from './components/Mission1Choice';
import { Mission2Inspect } from './components/Mission2Inspect';
import { Mission3GridPath } from './components/Mission3GridPath';
import { RestorationCutscene } from './components/RestorationCutscene';
import { CeremonyScreen } from './components/CeremonyScreen';
import { TeacherGuideModal } from './components/TeacherGuideModal';
import { sound } from './utils/sound';

export default function App() {
  const [stage, setStage] = useState<GameStage>('TITLE');
  const [lightsLit, setLightsLit] = useState<number>(0);
  const [playerName, setPlayerName] = useState<string>('용감한 탐사대원');
  const [isTeacherGuideOpen, setIsTeacherGuideOpen] = useState<boolean>(false);

  // Kami 3D state
  const [kamiPos, setKamiPos] = useState<GridPos>({ x: 0, z: 0 });
  const [kamiDir, setKamiDir] = useState<KamiDirection>('UP');
  const [kamiChestLit, setKamiChestLit] = useState<boolean>(false);

  // Handle start from Title
  const handleStartGame = (name: string) => {
    setPlayerName(name);
    setStage('INTRO');
    sound.startAmbientBgm();
  };

  // Complete Intro -> Go to Mission 1
  const handleCompleteIntro = () => {
    setStage('MISSION_1');
  };

  // Complete Mission 1 -> Lights = 1, Go to Mission 2
  const handleCompleteMission1 = () => {
    setLightsLit(1);
    setStage('MISSION_2');
  };

  // Complete Mission 2 -> Lights = 2, Go to Mission 3
  const handleCompleteMission2 = () => {
    setLightsLit(2);
    setKamiPos({ x: 0, z: 0 });
    setKamiDir('UP');
    setKamiChestLit(false);
    setStage('MISSION_3');
  };

  // Update Kami on Grid
  const handleUpdateKami = (pos: GridPos, dir: KamiDirection, chestLit: boolean) => {
    setKamiPos(pos);
    setKamiDir(dir);
    setKamiChestLit(chestLit);
  };

  // Complete Mission 3 -> Lights = 3, Go to Restoration
  const handleCompleteMission3 = () => {
    setLightsLit(3);
    setStage('RESTORATION');
  };

  // Complete Restoration -> Go to Ceremony
  const handleCompleteRestoration = () => {
    setStage('CEREMONY');
  };

  // Restart clean without reload
  const handleRestart = () => {
    setStage('TITLE');
    setLightsLit(0);
    setKamiPos({ x: 0, z: 0 });
    setKamiDir('UP');
    setKamiChestLit(false);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a0e1a] text-white font-dodum grid-bg select-none">
      {/* 3D Canvas World in Background */}
      <ThreeWorld
        stage={stage}
        lightsLit={lightsLit}
        kamiPos={kamiPos}
        kamiDir={kamiDir}
        kamiChestLit={kamiChestLit}
      />

      {/* Persistent Top Header (Stage info, audio toggles, teacher guide) */}
      <TopHeader
        stage={stage}
        lightsLit={lightsLit}
        onOpenTeacherGuide={() => setIsTeacherGuideOpen(true)}
        playerName={playerName}
      />

      {/* Screen Views based on Stage */}
      {stage === 'TITLE' && <TitleScreen onStart={handleStartGame} />}

      {stage === 'INTRO' && (
        <IntroCutscene onComplete={handleCompleteIntro} playerName={playerName} />
      )}

      {stage === 'MISSION_1' && <Mission1Choice onComplete={handleCompleteMission1} />}

      {stage === 'MISSION_2' && <Mission2Inspect onComplete={handleCompleteMission2} />}

      {stage === 'MISSION_3' && (
        <Mission3GridPath
          onComplete={handleCompleteMission3}
          kamiPos={kamiPos}
          kamiDir={kamiDir}
          onUpdateKami={handleUpdateKami}
        />
      )}

      {stage === 'RESTORATION' && (
        <RestorationCutscene onComplete={handleCompleteRestoration} playerName={playerName} />
      )}

      {stage === 'CEREMONY' && (
        <CeremonyScreen playerName={playerName} onRestart={handleRestart} />
      )}

      {/* Teacher Guide Modal */}
      <TeacherGuideModal
        isOpen={isTeacherGuideOpen}
        onClose={() => setIsTeacherGuideOpen(false)}
      />
    </main>
  );
}
