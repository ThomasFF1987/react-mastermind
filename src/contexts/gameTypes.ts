export interface GameState {
  proposition: string;
  code: string;
  tryCount: number;
  propositionHistory: string[];
}

export type KeyboardAction =
  | { type: "ADD_DIGIT"; value: number }
  | { type: "DELETE_DIGIT" }
  | { type: "VALIDATE"; value: string }
  | { type: "RESET" };
