import { Response } from "../types/Response";

const fonts = {
  kit: {
    id: "gvs0pdl",
    families: [
      {
        id: "krcv",
        family: "Utopia Std Headline",
        category: "utopia-std-headline",
        kind: "webfonts#webfont",
        subsets: ["utopia-std-headline"],
        variants: ["n4"]
      },
      {
        id: "kfjie",
        family: "Aloha style",
        category: "aloha-style",
        kind: "webfonts#webfont",
        subsets: ["aloha-style"],
        variants: ["n4"]
      }
    ]
  }
};

export const getAdobeFonts = {
  async handler(res: Response<typeof fonts>, rej: Response<string>) {
    if (true) {
      res(fonts);
    } else {
      rej("Failed to get fonts");
    }
  }
};
