export interface GameState {
  proposition: string;
  code: string;
  tryCount: number;
  propositionHistory: string[];
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
