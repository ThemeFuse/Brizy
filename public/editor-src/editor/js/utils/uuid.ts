import { customAlphabet } from "nanoid";

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const fullSymbolList =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";

export const uuid = (length = 12): string =>
  customAlphabet(alphabet, 1)() +
  customAlphabet(fullSymbolList, length)(length - 1);
