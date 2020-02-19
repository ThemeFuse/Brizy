import { Value } from "./types/Value";
import { Element } from "./types/Element";

export const fromValue = (v: Value): Element => {
  return { value: v.number, suffix: v.unit };
};
