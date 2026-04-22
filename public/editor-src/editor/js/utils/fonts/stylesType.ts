export type FontStyleTypes =
  | "paragraph"
  | "subtitle"
  | "abovetitle"
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "heading5"
  | "heading6"
  | "button";

export const fontStyle: FontStyleTypes[] = [
  "paragraph",
  "subtitle",
  "abovetitle",
  "heading1",
  "heading2",
  "heading3",
  "heading4",
  "heading5",
  "heading6",
  "button"
];

export const is = (s: string): s is FontStyleTypes =>
  fontStyle.includes(s as FontStyleTypes);
