const texts = {
  asciiArt: `
            .......▄████▄▄░
            ......▄▀█▀▐└─┐░░
            ......█▄▐▌▄█▄┘██
            ......└▄▄▄▄▄┘███
            ......██▒█▒███▀
            `,

  // General UI
  welcomeHeader: "Mintendo Entertainement *",
  loginInterface: "Main Server Login Interface",
  promptArrow: ">",
  enterPasswordLabel: "Enter password:",

  // Dynamic welcome texts
  welcomeUser: (name: string) => `Welcome ${name}-san,`,
  welcomeEnterPassword: (difficulty: number) =>
    `Please enter your ${difficulty} unique digits password.`,

  // Game feedback messages
  alreadyLoggedIn: (name: string) =>
    `You are already logged in, ${name}-san!`,
  accountLocked: "You've tried too many times, your account is locked.",
  invalidPasswordLength: (difficulty: number) =>
    `Error - Please enter a password of ${difficulty} unique digits.`,
  accessGranted: (name: string) =>
    `Access Granted. You're logged in, ${name}-san!`,
  failWithLockedPassword: (
    tryCount: number,
    maxTryCount: number,
    code: string
  ) => `${tryCount}/${maxTryCount} - Fail - Password was ${code} - Account locked.`,
  attemptResult: (
    tryCount: number,
    maxTryCount: number,
    proposition: string,
    result: string
  ) => `${tryCount}/${maxTryCount} - ${proposition}: Fail - Result: ${result}`,
  attemptSuccess: (
    tryCount: number,
    maxTryCount: number,
    proposition: string
  ) => `${tryCount}/${maxTryCount} - ${proposition}: Success`,
};

export default texts;