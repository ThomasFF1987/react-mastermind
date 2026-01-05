import { useGame } from "../contexts/useGame";

function Keyboard(){
  
  return (
      <Board />
  );
}

function Square({value, onSquareClick} : {value: number | string, onSquareClick : (value:number|string) => {}}) {
  return (
    <button className="square" onClick={() =>onSquareClick(value)}>{value}</button>
  );
}

function Board() {

  const { state, dispatch } = useGame();
    
  if (!dispatch) {
    return null;
  }
  
  return (
    <>
      <div className="game-keyboard">
        <Square value='1' onSquareClick={ async () => dispatch({type: "ADD_DIGIT", value: 1})} />
        <Square value='2' onSquareClick={ async () => dispatch({type: "ADD_DIGIT", value: 2})} />
        <Square value='3' onSquareClick={ async () => dispatch({type: "ADD_DIGIT", value: 3})} />
        <Square value='4' onSquareClick={ async () => dispatch({type: "ADD_DIGIT", value: 4})} />
        <Square value='5' onSquareClick={ async () => dispatch({type: "ADD_DIGIT", value: 5})} />
        <Square value='6' onSquareClick={ async () => dispatch({type: "ADD_DIGIT", value: 6})} />
        <Square value='7' onSquareClick={ async () => dispatch({type: "ADD_DIGIT", value: 7})} />
        <Square value='8' onSquareClick={ async () => dispatch({type: "ADD_DIGIT", value: 8})} />
        <Square value='9' onSquareClick={ async () => dispatch({type: "ADD_DIGIT", value: 9})} />
        <MyDeleteButton onButtonClick={async () => dispatch({type: "DELETE_DIGIT"})} />
        <Square value='0' onSquareClick={ async () => dispatch({type: "ADD_DIGIT", value: 0})} />
        <MyValidButton onButtonClick={async () => dispatch({type: "VALIDATE", value : state.proposition})}/>          
        <MyResetButton onButtonClick={async () => dispatch({type: "RESET"})}/>
      </div>
    </>
  );
}

function MyValidButton({ onButtonClick }: { onButtonClick: () => void }) {
  return (
    <button className="interface validate" onClick={onButtonClick}>V</button>
  );
}

function MyDeleteButton({ onButtonClick }: { onButtonClick: () => void }) {
  return (
    <button className="interface delete" onClick={onButtonClick}>C</button>
  );
}

function MyResetButton({onButtonClick}: {onButtonClick: () => void}) {
  return (
    <button className="interface reset" onClick={onButtonClick}>RESET</button>
  );
}

export default Keyboard;