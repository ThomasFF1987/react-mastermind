import { useEffect, useRef, useState } from "react";
import './App.css'

const user = {
  name: 'Shigeru',
  isLoggedIn: false,
};

const game = {
  difficulty: 5,
  maxTryCount: 10,
}

const appconfig = {
  minfontsize: 10,
  fontsizecoeff: 0.05,
};


function Square({value, onSquareClick} : {value: number | string, onSquareClick : (value:number|string) => {}}) {
  return (
    <button className="square" onClick={() =>onSquareClick(value)}>{value}</button>
  );
}

function Board({ proposition, code, tryCount, setTryCount, setProposition, setPropositionHistory }: { proposition: string; code: string; tryCount: number; setTryCount: (value: number) => void; setProposition: (value: string) => void; setPropositionHistory: (value: Array<string> | ((prev: Array<string>) => Array<string>)) => void }) {
  
  function handleClick(value: number) {
    if (proposition.length < game.difficulty) {
      setProposition(proposition + value.toString());
    }
  }
  
  return (
    <>
        <Square value='1' onSquareClick={ async () => handleClick(1)} />
        <Square value='2' onSquareClick={ async () => handleClick(2)} />
        <Square value='3' onSquareClick={ async () => handleClick(3)} />
        <Square value='4' onSquareClick={ async () => handleClick(4)} />
        <Square value='5' onSquareClick={ async () => handleClick(5)} />
        <Square value='6' onSquareClick={ async () => handleClick(6)} />
        <Square value='7' onSquareClick={ async () => handleClick(7)} />
        <Square value='8' onSquareClick={ async () => handleClick(8)} />
        <Square value='9' onSquareClick={ async () => handleClick(9)} />
        <MyDeleteButton proposition={proposition} setProposition={setProposition}/>
        <Square value='0' onSquareClick={ async () => handleClick(0)}/>
        <MyValidButton proposition={proposition} code={code} tryCount={tryCount} setTryCount={setTryCount} setPropositionHistory={setPropositionHistory} setProposition={setProposition}/>          
    </>
  );
}

function App() {
  const [code] = useState(() => generateCode()); // I know you are trying to cheat. :)
  const [proposition, setProposition] = useState("");
  const [propositionHistory, setPropositionHistory] = useState(Array<string>());
  const [tryCount, setTryCount] = useState(1);

  function generateCode() : string {
    const digits = Array.from({ length: 10 }, (_, i) => i);
    let newcode : string = "";
    while (newcode.length < game.difficulty) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      const digit = digits.splice(randomIndex, 1)[0];
      newcode += digit.toString();
    }
    console.log("Generated Code (for debugging):", newcode);
    return newcode;
  }

  return (
    <>
      <div className="game-computer">
        <GameScreen>
          <MyEntryHistory propositionHistory={propositionHistory} />
          <MyCurrentEntry proposition={proposition} tryCount={tryCount} />
        </GameScreen>
        <GameKeyboard proposition={proposition} code={code} tryCount={tryCount} setTryCount={setTryCount} setProposition={setProposition} setPropositionHistory={setPropositionHistory} />
      </div>
    </>
  )
}

function GameScreen({ children }: { children: React.ReactNode }) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    function updateFontSize() {
      if (screenRef.current) {
        const height = screenRef.current.clientHeight;
        const newheight = height * appconfig.fontsizecoeff;
        if(newheight < appconfig.minfontsize) setFontSize(appconfig.minfontsize);
        else setFontSize(newheight);
      }
    }
    updateFontSize();
    window.addEventListener("resize", updateFontSize);
    return () => window.removeEventListener("resize", updateFontSize);
  }, []);

  return (
    <div
      ref={screenRef}
      className="game-screen"
      style={{ fontSize: `${fontSize}px` }}
    >
      {children}
    </div>
  );
}

function GameKeyboard({ proposition, code, tryCount, setTryCount, setProposition, setPropositionHistory }: { proposition: string; code: string; tryCount: number; setTryCount: (value: number) => void; setProposition: (value: string) => void; setPropositionHistory: (value: Array<string> | ((prev: Array<string>) => Array<string>)) => void }){
  return (
    <div className="game-keyboard">
      <Board proposition={proposition} code={code} tryCount={tryCount} setTryCount={setTryCount} setProposition={setProposition} setPropositionHistory={setPropositionHistory} />
    </div>
  );
}

function MyEntryHistory({propositionHistory}: {propositionHistory: Array<string>}){
  return(
    <>
    <div className = "history">
      {propositionHistory.length >= 0 && (
        <>
        <p className="ascii-art">
...................▄████▄▄░<br/>
..................▄▀█▀▐└─┐░░<br/>
..................█▄▐▌▄█▄┘██<br/>
..................└▄▄▄▄▄┘███<br/>
..................██▒█▒███▀</p>
        <p>*/Nintando Entertainement Server Interface\*</p>
        <br/>
        <p>Welcome {user.name},</p>
        <p>Please enter your {game.difficulty} unique digit password to log in:</p>
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
      proposition.length === 0 && tryCount === 1 ?(
        <p>Enter password: _</p>
      ) : proposition.length === game.difficulty ? (
        <p>Enter password: {proposition}</p>
      ) : (
        <p>Enter password: {proposition}_</p>
      )
    }
    </>
  )
}

function MyValidButton({ proposition, code, tryCount, setTryCount, setPropositionHistory, setProposition }: { proposition: string; code: string; tryCount: number; setTryCount: (value: number) => void; setPropositionHistory: (value: Array<string> | ((prev: Array<string>) => Array<string>)) => void; setProposition: (value: string) => void }) {

  function updateHistory(result: string): void {
    setPropositionHistory((prev: string[]) => {
      const updated = [...prev, result];
      console.log("HISTORY UPDATED:", updated);
      return updated;
    });
    setProposition("");
  }

  function handleClick() {
    let message : string = "";
    if(proposition.length === 0 || proposition.length < game.difficulty) {
      message = "ERROR - PLEASE ENTER A CODE OF " + game.difficulty + " UNIQUE DIGITS.";
      updateHistory(message);
      return;
    }
    console.log("SEND CODE:", proposition);
    setTryCount(tryCount + 1);
    const result = checkProposition(proposition, code);
    
    if(result.nbGoodPlace === game.difficulty){
      message = tryCount +"/"+ game.maxTryCount + "-" + proposition + ": Success - You are logged in!";
      user.isLoggedIn = true;
    } else{
      if(tryCount < game.maxTryCount)
        message = tryCount +"/"+ game.maxTryCount + "-" + proposition + ": Fail - Result: " + result.nbGoodPlace + "-" + result.nbGoodNumber + ". Try again...";
      else
        message = tryCount +"/"+ game.maxTryCount + "-" + proposition + ": Fail - Password was " + code + " - Account locked.";
    }
    updateHistory(message);
  }

  function checkProposition(proposition: string, code: string) {
    let nbGoodPlace : number= 0;
    let nbGoodNumber : number = 0;

    if(proposition === code) {
      return {nbGoodPlace: proposition.length, nbGoodNumber: proposition.length};
    }

    for(let i : number = 0; i < proposition.length; i++) {
      for(let j : number = 0; j < code.length; j++) {
        if(proposition[i] === code[j]) {
          if(i==j)
            nbGoodPlace++;
          else
            nbGoodNumber++;

          j=code.length;
        }
      }
    }

    return {nbGoodPlace, nbGoodNumber};
  }

  return (
    <button className="interface validate" onClick={handleClick}>V</button>
  );
}

function MyDeleteButton({ proposition, setProposition }: { proposition: string; setProposition: (value: string) => void }) {

  function handleClick() {
    console.log("DELETE LAST NUMBER...");
    setProposition(proposition.slice(0, -1));
  }

  return (
    <button className="interface delete" onClick={handleClick}>C</button>
  );
}

export default App
