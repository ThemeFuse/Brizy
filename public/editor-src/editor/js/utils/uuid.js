import nanoidGenerate from "nanoid/generate";

const alphabet = "abcdefghijklmnopqrstuvwxyz";

export const uuid = (length = 10) => nanoidGenerate(alphabet, length);
