import { createContext, useReducer } from "react";
import { keyboardReducer, initialState } from "./keyboardReducer";
import type { GameState, KeyboardAction } from "./gameTypes";

type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<KeyboardAction>;
};

export const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(keyboardReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
