import nanoidGenerate from "nanoid/generate";

const alphabet = "abcdefghijklmnopqrstuvwxyz";

export const uuid = (length = 36) => nanoidGenerate(alphabet, length);
