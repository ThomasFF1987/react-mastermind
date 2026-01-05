import { GameContext } from "../contexts/GameContext";
import Screen from "./Screen";
import config from "./Configuration";
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
        <Screen>
          <MyEntryHistory propositionHistory={game.state.propositionHistory} />
          <MyCurrentEntry proposition={game.state.proposition} tryCount={game.state.tryCount} />
        </Screen>
        <Keyboard/>
      </div>
    </>
  )
}

function MyEntryHistory({propositionHistory}: {propositionHistory: Array<string>}){
  return(
    <>
    <div className = "history">
      {propositionHistory.length >= 0 && (
        <>
        <p className="ascii-art">
.......▄████▄▄░<br/>
......▄▀█▀▐└─┐░░<br/>
......█▄▐▌▄█▄┘██<br/>
......└▄▄▄▄▄┘███<br/>
......██▒█▒███▀</p>
        <p>{'>'} Mintendo Entertainement \*</p>
        <p>{'>'} Main Server Login Interface</p>
        <p>{'>'}</p>
        <p>{'>'} Welcome {config.user.name}-san,</p>
        <p>{'>'} Please enter your {config.game.difficulty} unique digits password.</p>
        </>
      )}
      {propositionHistory.map((entry, index) => (
        <p key={index}>
          {entry}
        </p>
      ))}
    </div> 
    </>
  );
}

function MyCurrentEntry({proposition, tryCount}: {proposition: string; tryCount: number}) {
  return(
    <>
    {
      config.user.isLoggedIn ? (
        <p>{'>'}</p>
      ) : proposition.length === 0 && tryCount === 1 ?(
        <p>{'>'} Enter password:<span className="cursor">_</span></p>
      ) : proposition.length === config.game.difficulty ? (
        <p>{'>'} Enter password:{proposition}</p>
      ) : (
        <p>{'>'} Enter password:{proposition}<span className="cursor">_</span></p>
      )
    }
    </>
  )
}

export default Computer;