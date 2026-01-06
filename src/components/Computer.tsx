import { GameContext } from "../contexts/GameContext";
import Screen from "./Screen";
import Keyboard from "./Keyboard";
import { useContext } from "react";

function Computer() {
  const game = useContext(GameContext);
  
  if (!game) {
    console.error("GameContext is null");
    return null;
  }
  
  return (
    <>
      <div className="game-computer">
        <Screen />
        <Keyboard />
      </div>
    </>
  )
}

export default Computer;