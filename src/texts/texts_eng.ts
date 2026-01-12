/* 
  This file contains all texts of the game.
  The goal is to simplify in the future the possibility to translate it.

  ~ThomasB. 12/01/2026
*/

const texts = {
  asciiArt: `
            .......▄████▄▄░
            ......▄▀█▀▐└─┐░░
            ......█▄▐▌▄█▄┘██
            ......└▄▄▄▄▄┘███
            ......██▒█▒███▀`,

  // General UI
  welcomeHeader: "* Nintendo Entertainement *",
  loginInterface: "* Main Server Login Interface *",
  promptArrow: "> ",
  enterPasswordLabel: "Enter password: ",
  enterUserIdLabel: "Enter user id (1/2/3): ",
  validButton: "V",
  cancelButton: "C",
  resetButton: "Reset",

  // Dynamic welcome texts
  welcomeUserIntro: "Welcome,",
  welcomeEnterUserId: "Please enter your user id (Shigeru:1, Iwata:2, Yamauchi:3) to log in.",

  welcomeEnterPassword: (name: string, difficulty: number) =>
    `${name}-san, please enter your ${difficulty} unique digits password.`,

  // Game feedback messages
  alreadyLoggedIn: (name: string) =>
    `You are already logged in, ${name}-san!`,
  accountLocked: "You've tried too many times, your account is locked.",
  invalidPasswordLength: (difficulty: number) =>
    `Error - Please enter a password of ${difficulty} unique digits.`,
  accessGranted: (name: string) =>
    ` - Access Granted. You're logged in, ${name}-san!`,
  failWithLockedPassword: (
    proposition: string,
    code: string
  ) => ` = ${proposition} - Fail - Password was ${code} - Account locked.`,
  attemptResult: (
    tryCount: number,
    maxTryCount: number,
    proposition: string
  ) => ` = ${proposition} - Fail - ${maxTryCount-tryCount} ${maxTryCount-tryCount === 1 ? 'try' : 'tries'} left...`,
  attemptSuccess: (
    name:string,
    proposition: string
  ) => ` = ${proposition} - Success - Access Granted, ${name}-san!`,
  pressRestartGameLabel : "Press Reset to restart the computer...",

};

export default texts;