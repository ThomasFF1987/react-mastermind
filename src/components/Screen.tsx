import { useGame } from "../contexts/useGame";
import texts from "../texts/texts_eng";
import type { GameState, HintResult } from "../maps/gameMaps";

function Screen(){
  const { state } = useGame();
    
  if (!state) {
    console.error("useGame state is null from Screen.tsx");
    return null;
  }

  return (
    <>
      <div className="game-screen" >
        <MyEntryHistory state={state}/>
        <MyCurrentEntry state={state}/>
      </div>
    </>
  );
}

function MyEntryHistory({ state }: { state : GameState }) {
  return(
    <>
    <div className = "history">
      {state.propositionHistory.length >= 0 && (
        <>
          <p className="ascii-art" dangerouslySetInnerHTML={{ __html: texts.asciiArt.replace(/\n/g, "<br/>") }} />
          <p>{texts.promptArrow}{texts.welcomeHeader}</p>
          <p>{texts.promptArrow}{texts.loginInterface}</p>
          <p>{texts.promptArrow}{texts.welcomeUserIntro}</p>
          <p>{texts.promptArrow}{texts.welcomeEnterUserId}</p>
          {state.user.name != "" ? (
            <p>{texts.promptArrow}{texts.welcomeEnterPassword(state.user.name, state.game.difficulty)}</p>
          ) : null}
        </>
      )}
      {state.propositionHistory.map((entry, index) => (
        <p key={index}>
          {texts.promptArrow}
          {state.hintResults[index] && <HintDisplay hints={state.hintResults[index]} />}
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

function MyCurrentEntry({ state }: { state : GameState }) {
  switch(state.phase){
    case "Game":
      return(
        <>
        {
          (state.user.isLoggedIn || state.user.isLocked) ? (
            <p>
              {texts.promptArrow} {texts.pressRestartGameLabel}
            </p>
          ) : state.proposition.length === 0 && state.tryCount === 0 ?(
            <p>
              {texts.promptArrow} {texts.enterPasswordLabel}
              <span className="cursor">_</span>
            </p>
          ) : state.proposition.length === state.game.difficulty ? (
            <p>
              {texts.promptArrow} {texts.enterPasswordLabel}
              {state.proposition}
            </p>
          ) : (
            <p>
              {texts.promptArrow} {texts.enterPasswordLabel}
              {state.proposition}
              <span className="cursor">_</span>
            </p>
          )
        }
        </>
      )
    case "Setup":
      return(
        <>
        {
          (state.proposition.length === 0) ? (<p>
            {texts.promptArrow} {texts.enterUserIdLabel}
            <span className="cursor">_</span>
          </p>
          ) : (
            <p>
              {texts.promptArrow} {texts.enterUserIdLabel}
              {state.proposition}
            </p>
          )
        }
        </>
      )
    default:
      return(
      <> 
      </>
      )
      break;
  }
  
}

export default Screen;