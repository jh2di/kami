export type GameStage =
  | 'TITLE'
  | 'INTRO'
  | 'MISSION_1'
  | 'MISSION_2'
  | 'MISSION_3'
  | 'RESTORATION'
  | 'CEREMONY';

export interface PlayerInfo {
  name: string;
}

export interface ChoiceOption {
  id: string;
  title: string;
  subText: string;
  emoji: string;
  color: string;
}

export interface Mission1Step {
  id: number;
  prompt: string;
  options: [ChoiceOption, ChoiceOption];
}

export type JudgmentType = 'MAYBE' | 'NEED_MORE_INFO' | 'SHOULD_NOT';

export interface Mission2Question {
  id: number;
  speaker: string;
  statement: string;
  correctJudgments: JudgmentType[];
  explanation: string;
  targetFriend: string;
  friendTrait: string;
  aiAssumption: string;
}

export interface GridPos {
  x: number;
  z: number;
}

export type KamiDirection = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';
