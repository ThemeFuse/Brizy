import getFontById from "./getFontById";

export const makeFontsUrl = fonts => {
  const family = fonts.map(font => getFontById(font).url).join("|");

  return `https://fonts.googleapis.com/css?family=${family}&subset=arabic,bengali,cyrillic,cyrillic-ext,devanagari,greek,greek-ext,gujarati,hebrew,khmer,korean,latin-ext,tamil,telugu,thai,vietnamese`;
};
