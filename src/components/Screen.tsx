import { useGame } from "../contexts/useGame";
import texts from "../texts/texts_eng";

function Screen(){
  const { state } = useGame();
    
  if (!state) {
    console.error("useGame state is null from Screen.tsx");
    return null;
  }

  return (
    <>
      <div className="game-screen" >
        <MyEntryHistory {...state} />
        <MyCurrentEntry {...state} />
      </div>
    </>
  );
}

function MyEntryHistory({ propositionHistory, user, game }: { propositionHistory: string[]; user: any; game: any }) {
  return(
    <>
    <div className = "history">
      {propositionHistory.length >= 0 && (
        <>
          <p className="ascii-art" dangerouslySetInnerHTML={{ __html: texts.asciiArt.replace(/\n/g, "<br/>") }} />
          <p>{texts.promptArrow} {texts.welcomeHeader}</p>
          <p>{texts.promptArrow} {texts.loginInterface}</p>
          <p>{texts.promptArrow}</p>
          <p>{texts.promptArrow} {texts.welcomeUser(user.name)}</p>
          <p>{texts.promptArrow} {texts.welcomeEnterPassword(game.difficulty)}</p>
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

function MyCurrentEntry({ proposition, tryCount, user, game }: { proposition: string; tryCount: number; user: any; game: any }) {
  return(
    <>
    {
      user.isLoggedIn ? (
        <p>{'>'}</p>
      ) : proposition.length === 0 && tryCount === 0 ?(
        <p>{'>'} Enter password:<span className="cursor">_</span></p>
      ) : proposition.length === game.difficulty ? (
        <p>{'>'} Enter password:{proposition}</p>
      ) : (
        <p>{'>'} Enter password:{proposition}<span className="cursor">_</span></p>
      )
    }
    </>
  )
}

export default Screen;