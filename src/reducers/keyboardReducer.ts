import type { GameState, KeyboardAction } from "../maps/gameMaps";

export const createInitialState = (): GameState => ({
  proposition: "",
  tryCount: 1,
  code: generateCode(5),
  propositionHistory: [],
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

      if(state.user.isLoggedIn) {
        // L'utilisateur est déjà connecté
        hintMessage = "> You are already logged in, "+state.user.name+"-san!";
      }
      else if(state.user.isLocked) {
        // L'utilisateur n'a pas trouvé le mot de passe et son compte est verrouillé
        hintMessage = "> You've tried too many times, your account is locked.";
      }
      else if (state.proposition.length !== state.game.difficulty) {
        // Proposition invalide
        //console.log("> Error - Please enter a password of " + state.game.difficulty + " unique digits.");
        hintMessage = "> Error - Please enter a password of "+ state.game.difficulty +" unique digits.";
      }
      else if (state.proposition === state.code) {
        //console.log("> Access Granted. You're logged in, " + state.user.name + "-san!");
        loggedIn = true;
        hintMessage = "> Access Granted. You're logged in, "+ state.user.name +"-san!";
        newTryCount += 1;
      }
      else if(state.tryCount >= state.game.maxTryCount) {
        //console.log("> Fail - Maximum number of tries reached. Account locked. The password was " + state.code + ".");
        lockedStatus = true;
        hintMessage = "> "+state.tryCount+"/"+state.game.maxTryCount+" - Fail - Password was "+state.code+" - Account locked.";
        newTryCount += 1;
      }   
      else{
        // Si aucune des conditions précédentes n'est remplie, on vérifie la proposition et on affiche l'indice.
        const result = checkProposition(state.proposition, state.code);
      
        if(result.nbGoodPlace === state.game.difficulty){
          // Affichage d'un message de succès si le code est correct
          loggedIn = true;
          hintMessage = "> "+state.tryCount +"/"+ state.game.maxTryCount + "-" + state.proposition + ": Success";
          newTryCount += 1;
        } else{
          // Affichage d'un message d'erreur si le code est incorrect
          if(state.tryCount < state.game.maxTryCount){
            hintMessage = "> "+state.tryCount +"/"+ state.game.maxTryCount + "-" + state.proposition + ": Fail - Result: " + result.result;
            newTryCount += 1;
          }
          else{
            lockedStatus = true;
            hintMessage = "> "+state.tryCount +"/"+ state.game.maxTryCount + "-" + state.proposition + ": Fail - Password was " + state.code + " - Account locked.";
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
        proposition: "",
        tryCount: newTryCount,
      };

    case "RESET":
      return createInitialState();

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
