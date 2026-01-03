import { useState } from "react";
import Screen from "./Screen";
import config from "./Configuration";

function Computer() {
  const [code] = useState(() => generateCode()); // I know you are trying to cheat. :)
  const [proposition, setProposition] = useState("");
  const [propositionHistory, setPropositionHistory] = useState(Array<string>());
  const [tryCount, setTryCount] = useState(1);

  function generateCode() : string {
    const digits = Array.from({ length: 10 }, (_, i) => i);
    let newcode : string = "";
    while (newcode.length < config.game.difficulty) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      const digit = digits.splice(randomIndex, 1)[0];
      newcode += digit.toString();
    }
    //console.log("Generated Code (for debugging):", newcode);
    return newcode;
  }

  return (
    <>
      <div className="game-computer">
        <Screen>
          <MyEntryHistory propositionHistory={propositionHistory} />
          <MyCurrentEntry proposition={proposition} tryCount={tryCount} />
        </Screen>
        <GameKeyboard proposition={proposition} code={code} tryCount={tryCount} setTryCount={setTryCount} setProposition={setProposition} setPropositionHistory={setPropositionHistory} />
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
        <p>{'>'} Nintando Entertainement \*</p>
        <p>{'>'} Main Server Login Interface</p>
        <br/>
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
      proposition.length === 0 && tryCount === 1 ?(
        <p>Enter password: _</p>
      ) : proposition.length === config.game.difficulty ? (
        <p>Enter password: {proposition}</p>
      ) : (
        <p>Enter password: {proposition}_</p>
      )
    }
    </>
  )
}

function GameKeyboard({ proposition, code, tryCount, setTryCount, setProposition, setPropositionHistory }: { proposition: string; code: string; tryCount: number; setTryCount: (value: number) => void; setProposition: (value: string) => void; setPropositionHistory: (value: Array<string> | ((prev: Array<string>) => Array<string>)) => void }){
  return (
    <div className="game-keyboard">
      <Board proposition={proposition} code={code} tryCount={tryCount} setTryCount={setTryCount} setProposition={setProposition} setPropositionHistory={setPropositionHistory} />
    </div>
  );
}

function Square({value, onSquareClick} : {value: number | string, onSquareClick : (value:number|string) => {}}) {
  return (
    <button className="square" onClick={() =>onSquareClick(value)}>{value}</button>
  );
}

function Board({ proposition, code, tryCount, setTryCount, setProposition, setPropositionHistory }: { proposition: string; code: string; tryCount: number; setTryCount: (value: number) => void; setProposition: (value: string) => void; setPropositionHistory: (value: Array<string> | ((prev: Array<string>) => Array<string>)) => void }) {
  
  function handleClick(value: number) {
    if (proposition.length < config.game.difficulty) {
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

function MyValidButton({ proposition, code, tryCount, setTryCount, setPropositionHistory, setProposition }: { proposition: string; code: string; tryCount: number; setTryCount: (value: number) => void; setPropositionHistory: (value: Array<string> | ((prev: Array<string>) => Array<string>)) => void; setProposition: (value: string) => void }) {

  function updateHistory(result: string): void {
    setPropositionHistory((prev: string[]) => {
      const updated = [...prev, result];
      //console.log("HISTORY UPDATED:", updated);
      return updated;
    });
    setProposition("");
  }

  function handleClick() {
    let message : string = "";
    if(proposition.length === 0 || proposition.length < config.game.difficulty) {
      message = ">ERROR - PLEASE ENTER A CODE OF " + config.game.difficulty + " UNIQUE DIGITS.";
      updateHistory(message);
      return;
    }
    //console.log("SEND CODE:", proposition);
    setTryCount(tryCount + 1);
    const result = checkProposition(proposition, code);
    
    if(result.nbGoodPlace === config.game.difficulty){
      message = "> "+tryCount +"/"+ config.game.maxTryCount + "-" + proposition + ": Success - You are logged in!";
      config.user.isLoggedIn = true;
    } else{
      if(tryCount < config.game.maxTryCount)
        message = "> "+tryCount +"/"+ config.game.maxTryCount + "-" + proposition + ": Fail - Result: " + result.result;
      else
        message = "> "+tryCount +"/"+ config.game.maxTryCount + "-" + proposition + ": Fail - Password was " + code + " - Account locked.";
    }
    updateHistory(message);
  }

  function checkProposition(proposition: string, code: string) {
    let nbGoodPlace : number= 0;
    let nbGoodNumber : number = 0;
    let result : string = "";

    if(proposition === code) {
      return {nbGoodPlace: proposition.length, nbGoodNumber: proposition.length};
    }

    for(let i : number = 0; i < proposition.length; i++) {
      for(let j : number = 0; j < code.length; j++) {
        if(proposition[i] === code[j]) {
          if(i==j){
            nbGoodPlace++;
            result += "!";
          }
          else{
            nbGoodNumber++;
            result += "?";
          }
          j=code.length;
        }
        else{
          if(j === code.length -1){
            result += "X";
          }
        }
      }
    }

    return {nbGoodPlace, nbGoodNumber, result};
  }

  return (
    <button className="interface validate" onClick={handleClick}>V</button>
  );
}

function MyDeleteButton({ proposition, setProposition }: { proposition: string; setProposition: (value: string) => void }) {

  function handleClick() {
    //console.log("DELETE LAST NUMBER...");
    setProposition(proposition.slice(0, -1));
  }

  return (
    <button className="interface delete" onClick={handleClick}>C</button>
  );
}

export default Computer;