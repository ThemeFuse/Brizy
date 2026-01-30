import { FontStyle } from "../types/DefaultTemplate";

const tripId = (str: string) => str.toLowerCase().replace(/\s+/g, "_");

export const normalizeFontStyles = (fontStyles: FontStyle[]): FontStyle[] =>
  fontStyles.map((fontStyle) => ({
    ...fontStyle,
    fontFamily: tripId(fontStyle.fontFamily)
  }));
