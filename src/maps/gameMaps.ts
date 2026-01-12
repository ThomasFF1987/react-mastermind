export type HintResult = 'correctlyPlaced' | 'wronglyPlaced' | 'notInCode';

export interface CheckPropositionResult {
  nbGoodPlace: number;
  nbGoodNumber: number;
  hintResults: HintResult[];
}

type GamePhase = 'Initialization' | 'Setup' | 'Game' | 'Victory' | 'GameOver';

export interface GameState {
  phase: GamePhase;
  proposition: string;
  code: string;
  tryCount: number;
  propositionHistory: string[];
  hintResults: HintResult[][];
  game : {
    difficulty: number;
    maxTryCount: number;
  };
  user: {
    name: string;
    isLoggedIn: boolean;
    isLocked: boolean;
  };
}

export type KeyboardAction =
  | { type: "ADD_DIGIT"; value: number }
  | { type: "DELETE_DIGIT" }
  | { type: "VALIDATE"; value: string }
  | { type: "RESET" };
