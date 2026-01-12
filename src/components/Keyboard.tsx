import { useGame } from "../contexts/useGame";
import texts from "../texts/texts_eng";

function Keyboard() {

  const { state, dispatch } = useGame();
    
  if (!state || !dispatch) {
    console.error("useGame state or dispatch is null from Keyboard.tsx");
    return null;
  }
  
  return (
    <>
      <div className="game-keyboard">
        <Square value='1' onSquareClick={ () => dispatch({type: "ADD_DIGIT", value: 1})} />
        <Square value='2' onSquareClick={ () => dispatch({type: "ADD_DIGIT", value: 2})} />
        <Square value='3' onSquareClick={ () => dispatch({type: "ADD_DIGIT", value: 3})} />
        <Square value='4' onSquareClick={ () => dispatch({type: "ADD_DIGIT", value: 4})} />
        <Square value='5' onSquareClick={ () => dispatch({type: "ADD_DIGIT", value: 5})} />
        <Square value='6' onSquareClick={ () => dispatch({type: "ADD_DIGIT", value: 6})} />
        <Square value='7' onSquareClick={ () => dispatch({type: "ADD_DIGIT", value: 7})} />
        <Square value='8' onSquareClick={ () => dispatch({type: "ADD_DIGIT", value: 8})} />
        <Square value='9' onSquareClick={ () => dispatch({type: "ADD_DIGIT", value: 9})} />
        <MyDeleteButton   onButtonClick={ () => dispatch({type: "DELETE_DIGIT"})} />
        <Square value='0' onSquareClick={ () => dispatch({type: "ADD_DIGIT", value: 0})} />
        <MyValidButton    onButtonClick={ () => dispatch({type: "VALIDATE", value : state.proposition})}/>          
        <MyResetButton    onButtonClick={ () => dispatch({type: "RESET"})}/>
      </div>
    </>
  );
}

function Square({value, onSquareClick} : {value: number | string, onSquareClick : (value:number|string) => void}) {
  return (
    <button className="square" onClick={() =>onSquareClick(value)}>{value}</button>
  );
}

function MyValidButton({ onButtonClick }: { onButtonClick: () => void }) {
  return (
    <button className="interface validate" onClick={onButtonClick}>{texts.validButton}</button>
  );
}

function MyDeleteButton({ onButtonClick }: { onButtonClick: () => void }) {
  return (
    <button className="interface delete" onClick={onButtonClick}>{texts.cancelButton}</button>
  );
}

function MyResetButton({onButtonClick}: {onButtonClick: () => void}) {
  return (
    <button className="interface reset" onClick={onButtonClick}>{texts.resetButton}</button>
  );
}

export default Keyboard;