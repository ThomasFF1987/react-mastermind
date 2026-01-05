import type { GameState, KeyboardAction } from "./gameTypes";
import config from "../components/Configuration";

export const initialState: GameState = {
  proposition: "",
  tryCount: 1,
  code: generateCode(config.game.difficulty),
  propositionHistory: [],
};

export function keyboardReducer(
  state: GameState,
  action: KeyboardAction
): GameState {
  switch (action.type) {
    case "ADD_DIGIT":
      if(state.proposition.length >= config.game.difficulty) {
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
      if(config.user.isLoggedIn) {
        // L'utilisateur est déjà connecté
        return {
          ...state,
          propositionHistory: [
            ...state.propositionHistory,
            `> You are already logged in,  ${config.user.name}-san!`,
          ],
          proposition: "",
          tryCount: state.tryCount,
        };
      }
      if(config.user.isLocked) {
        // L'utilisateur n'a pas trouvé le mot de passe et son compte est verrouillé
        return {
          ...state,
          propositionHistory: [
            ...state.propositionHistory,
            `> You've tried too many times, your account is locked.`,
          ],
          proposition: "",
          tryCount: state.tryCount,
        };
      }
      if (state.proposition.length !== config.game.difficulty) {
        // Proposition invalide
        //console.log("> Error - Please enter a password of " + config.game.difficulty + " unique digits.");
        return {
          ...state,
          propositionHistory: [
            ...state.propositionHistory,
            `> Error - Please enter a password of ${config.game.difficulty} unique digits.`,
          ],
          proposition: "",
          tryCount: state.tryCount,
        };
      }
      if (state.proposition === state.code) {
        //console.log("> Access Granted. You're logged in, " + config.user.name + "-san!");
        config.user.isLoggedIn = true;
        return {
          ...state,
          propositionHistory: [
            ...state.propositionHistory,
            `> Access Granted. You're logged in, ${config.user.name}-san!`,
          ],
          proposition: "",
          tryCount: state.tryCount + 1,
        };
      }
      if(state.tryCount >= config.game.maxTryCount) {
        //console.log("> Fail - Maximum number of tries reached. Account locked. The password was " + state.code + ".");
        config.user.isLocked = true;
        return { 
          ...state,
          propositionHistory: [
            ...state.propositionHistory,
            `> ${state.tryCount}/${config.game.maxTryCount} - Fail - Password was ${state.code} - Account locked.`,
          ],
          proposition: "",
          tryCount: state.tryCount + 1,
        };
      }

      // Si aucune des conditions précédentes n'est remplie, on vérifie la proposition et on affiche l'indice.
      const result = checkProposition(state.proposition, state.code);
      let hintMessage : string = "";
      if(result.nbGoodPlace === config.game.difficulty){
        // Affichage d'un message de succès si le code est correct
        hintMessage = "> "+state.tryCount +"/"+ config.game.maxTryCount + "-" + state.proposition + ": Success";
      } else{
        // Affichage d'un message d'erreur si le code est incorrect
        if(state.tryCount < config.game.maxTryCount)
          hintMessage = "> "+state.tryCount +"/"+ config.game.maxTryCount + "-" + state.proposition + ": Fail - Result: " + result.result;
        else{
          config.user.isLocked = true;
          hintMessage = "> "+state.tryCount +"/"+ config.game.maxTryCount + "-" + state.proposition + ": Fail - Password was " + state.code + " - Account locked.";
        }
      }

      return {
        ...state,
        propositionHistory: [
          ...state.propositionHistory,
          hintMessage,
        ],
        proposition: "",
        tryCount: state.tryCount + 1,
      };

    case "RESET":
      config.user.isLoggedIn = false;
      config.user.isLocked = false;
      return initialState;

    default:
      return state;
  }
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
