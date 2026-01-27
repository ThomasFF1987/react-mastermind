import type { GameState, HintResult, KeyboardAction, CheckPropositionResult } from "../maps/gameMaps";
import texts from "../texts/texts_eng";

export const createInitialState = (): GameState => ({
  phase: "Setup",
  proposition: "",
  tryCount: 1,
  code: "",
  propositionHistory: [],
  hintResults: [],
  game : {
    difficulty: 0,
    maxTryCount: 10,
  },
  user: {
    name: '',
    isLoggedIn: false,
    isLocked: false,
  },
});

export const createSetupState = (codelength : number, userName : string):GameState => ({
  phase: "Game",
  proposition: "",
  tryCount: 1,
  code: generateCode(codelength),
  propositionHistory: [],
  hintResults: [],
  game : {
    difficulty: codelength,
    maxTryCount: 10,
  },
  user: {
    name: userName,
    isLoggedIn: false,
    isLocked: false,
  },
});

export function keyboardReducer( state: GameState, action: KeyboardAction ): GameState {
  switch (action.type) {
    case "ADD_DIGIT":
      if(state.phase === "Game"){
        if(state.proposition.length >= state.game.difficulty) {
          return state; // Ne pas ajouter plus de chiffres que la difficulté
        }

        return {
          ...state,
          proposition: state.proposition + action.value,
        };
      }
      else{
        return {
          ...state,
          proposition: action.value.toString(),
        };
      }
      

    case "DELETE_DIGIT":
      return {
        ...state,
        proposition: state.proposition.slice(0, -1),
      };

    case "VALIDATE":
      if(state.phase === "Game"){
        return pressValidDuringGame(state);
      }
      else if(state.phase === "Setup"){
        return pressValidDuringSetup(state);
      }
      return state;

    case "RESET":
      return createInitialState();

    default:
      return state;
  }
}

function checkProposition(proposition: string, code: string): CheckPropositionResult {
    let nbGoodPlace : number = 0;
    let nbGoodNumber : number = 0;
    const hintResults : HintResult[] = [];

    if(proposition === code) {
      return {nbGoodPlace: proposition.length, nbGoodNumber: proposition.length, hintResults: Array(proposition.length).fill('correctlyPlaced')};
    }

    // Créer des tableaux pour marquer les chiffres déjà utilisés
    const codeUsed: boolean[] = Array(code.length).fill(false);
    const propUsed: boolean[] = Array(proposition.length).fill(false);

    // Premier passage : identifier les chiffres bien placés
    for(let i = 0; i < proposition.length; i++) {
      if(proposition[i] === code[i]) {
        nbGoodPlace++;
        hintResults[i] = 'correctlyPlaced';
        codeUsed[i] = true;
        propUsed[i] = true;
      }
    }

    // Deuxième passage : identifier les chiffres mal placés
    for(let i = 0; i < proposition.length; i++) {
      if(!propUsed[i]) {
        let found = false;
        for(let j = 0; j < code.length; j++) {
          if(!codeUsed[j] && proposition[i] === code[j]) {
            nbGoodNumber++;
            hintResults[i] = 'wronglyPlaced';
            codeUsed[j] = true;
            found = true;
            break;
          }
        }
        if(!found) {
          hintResults[i] = 'notInCode';
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

function hasUniqueDigits(proposition: string): boolean {
  const digits = proposition.split('');
  const uniqueDigits = new Set(digits);
  return digits.length === uniqueDigits.size;
}

function pressValidDuringGame(state : GameState) : GameState {
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
    // Proposition invalide - longueur incorrecte
    hintMessage = `${texts.invalidPasswordLength(state.game.difficulty)}`;
    currentHintResults = [];
  }
  else if (!hasUniqueDigits(state.proposition)) {
    // Proposition invalide - chiffres non uniques
    hintMessage = `${texts.invalidPasswordDuplicates}`;
    currentHintResults = [];
  }
  else if (state.proposition === state.code) {
    loggedIn = true;
    hintMessage = `${texts.attemptSuccess(state.user.name, state.proposition)}`;
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
      hintMessage = `${texts.attemptSuccess(state.user.name, state.proposition)}`;
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

}

function pressValidDuringSetup(state : GameState) : GameState {
  let userName = "";
  let setupDifficulty = 0;

  switch(state.proposition){
    case "1":
      userName = "Shigeru";
      setupDifficulty = 5;
      return createSetupState(setupDifficulty, userName);

    case "2":
      userName = "Iwata";
      setupDifficulty = 6;
      return createSetupState(setupDifficulty, userName);
    
    case "3":
      userName = "Yamauchi";
      setupDifficulty = 7;
      return createSetupState(setupDifficulty, userName);

    default:
      return createInitialState();
  }

}