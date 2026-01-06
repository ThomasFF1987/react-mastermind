const texts = {
  asciiArt: `
            .......▄████▄▄░
            ......▄▀█▀▐└─┐░░
            ......█▄▐▌▄█▄┘██
            ......└▄▄▄▄▄┘███
            ......██▒█▒███▀
            `,

  welcomeHeader: "Mintendo Entertainement *",
  loginInterface: "Main Server Login Interface",
  promptArrow: ">",

  welcomeUser: (name: string) => `Welcome ${name}-san,`,
  welcomeEnterPassword: (difficulty: number) => `Please enter your ${difficulty} unique digits password.`,

};

export default texts;