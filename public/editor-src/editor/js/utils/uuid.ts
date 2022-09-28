import { customAlphabet } from "nanoid";

const alphabet = "abcdefghijklmnopqrstuvwxyz";

export const uuid = (length = 36): string =>
  customAlphabet(alphabet, length)(length);
