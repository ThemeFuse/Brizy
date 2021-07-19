import { Literal, read as readLiteral } from "visual/utils/types/Literal";

export type Value = { value: Literal[] };

export const read = readLiteral;
