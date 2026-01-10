import { useGame } from "../contexts/useGame";
import texts from "../texts/texts_eng";
import type { HintResult } from "../maps/gameMaps";

function Screen(){
  const { state } = useGame();
    
  if (!state) {
    console.error("useGame state is null from Screen.tsx");
    return null;
  }

  return (
    <>
      <div className="game-screen" >
        <MyEntryHistory propositionHistory={state.propositionHistory} hintResults={state.hintResults} user={state.user} game={state.game} />
        <MyCurrentEntry proposition={state.proposition} tryCount={state.tryCount} user={state.user} game={state.game} />
      </div>
    </>
  );
}

interface MyEntryHistoryProps {
  propositionHistory: string[];
  hintResults: HintResult[][];
  user: any;
  game: any;
}

function MyEntryHistory({ propositionHistory, hintResults, user, game }: MyEntryHistoryProps) {
  return(
    <>
    <div className = "history">
      {propositionHistory.length >= 0 && (
        <>
          <p className="ascii-art" dangerouslySetInnerHTML={{ __html: texts.asciiArt.replace(/\n/g, "<br/>") }} />
          <p>{texts.promptArrow} {texts.welcomeHeader}</p>
          <p>{texts.promptArrow} {texts.loginInterface}</p>
          <p>{texts.promptArrow} {texts.welcomeUser(user.name)}</p>
          <p>{texts.welcomeEnterPassword(game.difficulty)}</p>
        </>
      )}
      {propositionHistory.map((entry, index) => (
        <p key={index}>
          {texts.promptArrow}
          {hintResults[index] && <HintDisplay hints={hintResults[index]} />}
          {entry}
        </p>
      ))}
    </div> 
    </>
  );
}

function HintDisplay({ hints }: { hints: HintResult[] }) {
  return (
    <span className="hint-display">
      {hints.map((hint, index) => (
        <span key={index} className={`hint-circle ${hint}`}></span>
      ))}
    </span>
  );
}

function MyCurrentEntry({ proposition, tryCount, user, game }: { proposition: string; tryCount: number; user: any; game: any }) {
  return(
    <>
    {
      user.isLoggedIn ? (
        <p>{texts.promptArrow}</p>
      ) : proposition.length === 0 && tryCount === 0 ?(
        <p>
          {texts.promptArrow} {texts.enterPasswordLabel}
          <span className="cursor">_</span>
        </p>
      ) : proposition.length === game.difficulty ? (
        <p>
          {texts.promptArrow} {texts.enterPasswordLabel}
          {proposition}
        </p>
      ) : (
        <p>
          {texts.promptArrow} {texts.enterPasswordLabel}
          {proposition}
          <span className="cursor">_</span>
        </p>
      )
    }
    </>
  )
}

export default Screen;