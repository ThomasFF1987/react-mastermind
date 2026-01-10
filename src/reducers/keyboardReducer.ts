import type { GameState, HintResult, KeyboardAction, CheckPropositionResult } from "../maps/gameMaps";
import texts from "../texts/texts_eng";

export const createInitialState = (): GameState => ({
  proposition: "",
  tryCount: 1,
  code: generateCode(5),
  propositionHistory: [],
  hintResults: [],
  game : {
    difficulty: 5,
    maxTryCount: 10,
  },
  user: {
    name: 'Shigeru',
    isLoggedIn: false,
    isLocked: false,
  },
});

export function keyboardReducer( state: GameState, action: KeyboardAction ): GameState {
  switch (action.type) {
    case "ADD_DIGIT":
      if(state.proposition.length >= state.game.difficulty) {
        return state; // Ne pas ajouter plus de chiffres que la difficulté
      }

      return {
        ...state,
        proposition: state.proposition + action.value,
      };

    case "DELETE_DIGIT":
      return {
        ...state,
        proposition: state.proposition.slice(0, -1),
      };

    case "VALIDATE":
      let hintMessage : string = "";
      let newTryCount : number = state.tryCount;
      let loggedIn : boolean = state.user.isLoggedIn;
      let lockedStatus : boolean = state.user.isLocked;
      let currentHintResults: HintResult[] = [];
      
      if(state.user.isLoggedIn) {
        // L'utilisateur est déjà connecté
        hintMessage = `${texts.alreadyLoggedIn(state.user.name)}`;
        currentHintResults = [];
      }
      else if(state.user.isLocked) {
        // L'utilisateur n'a pas trouvé le mot de passe et son compte est verrouillé
        hintMessage = `${texts.accountLocked}`;
        currentHintResults = [];
      }
      else if (state.proposition.length !== state.game.difficulty) {
        // Proposition invalide
        hintMessage = `${texts.invalidPasswordLength(state.game.difficulty)}`;
        currentHintResults = [];
      }
      else if (state.proposition === state.code) {
        loggedIn = true;
        hintMessage = `${texts.accessGranted(state.user.name)}`;
        newTryCount += 1;
        currentHintResults = Array(state.game.difficulty).fill('correctlyPlaced');
      }
      else{
        // Si aucune des conditions précédentes n'est remplie, on vérifie la proposition et on affiche l'indice.
        const result = checkProposition(state.proposition, state.code);
        currentHintResults = result.hintResults;
      
        if(result.nbGoodPlace === state.game.difficulty){
          // Affichage d'un message de succès si le code est correct
          loggedIn = true;
          hintMessage = `${texts.attemptSuccess(state.tryCount, state.game.maxTryCount, state.proposition)}`;
          newTryCount += 1;
        } else{
          // Affichage d'un message d'erreur si le code est incorrect
          if(state.tryCount < state.game.maxTryCount){
            hintMessage = `${texts.attemptResult(state.tryCount, state.game.maxTryCount, state.proposition)}`;
            newTryCount += 1;
          }
          else{
            lockedStatus = true;
            hintMessage = `${texts.failWithLockedPassword(state.proposition, state.code)}`;
            newTryCount += 1;
          }
        }
      }

      return {
        ...state,
        user: {
          ...state.user,
          isLocked: lockedStatus,
          isLoggedIn : loggedIn,
        },
        propositionHistory: [
          ...state.propositionHistory,
          hintMessage,
        ],
        hintResults: [
          ...state.hintResults,
          currentHintResults,
        ],
        proposition: "",
        tryCount: newTryCount,
      };

    case "RESET":
      return createInitialState();

    default:
      return state;
  }
}

function checkProposition(proposition: string, code: string): CheckPropositionResult {
    let nbGoodPlace : number= 0;
    let nbGoodNumber : number = 0;
    //let result : string = "";
    let hintResults : HintResult[] = [];

    if(proposition === code) {
      return {nbGoodPlace: proposition.length, nbGoodNumber: proposition.length, hintResults: Array(proposition.length).fill('correctlyPlaced')};
    }

    for(let i : number = 0; i < proposition.length; i++) {
      for(let j : number = 0; j < code.length; j++) {
        if(proposition[i] === code[j]) {
          if(i==j){
            nbGoodPlace++;
            hintResults.push('correctlyPlaced');
          }
          else{
            nbGoodNumber++;
            hintResults.push('wronglyPlaced');
          }
          j=code.length;
        }
        else{
          if(j === code.length -1){
            hintResults.push('notInCode');
          }
        }
      }
    }

    return {nbGoodPlace, nbGoodNumber, hintResults: hintResults};
}

function generateCode(codelength:number) : string {
  const digits = Array.from({ length: 10 }, (_, i) => i);
  let newcode : string = "";
  while (newcode.length < codelength) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    const digit = digits.splice(randomIndex, 1)[0];
    newcode += digit.toString();
  }
  //console.log("Generated Code (for debugging):", newcode);
  return newcode;
}
