import { createContext, useReducer } from "react";
import { keyboardReducer, createInitialState } from "../reducers/keyboardReducer";
import type { GameState, KeyboardAction } from "../maps/gameMaps";

type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<KeyboardAction>;
};

export const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(keyboardReducer, createInitialState());

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
