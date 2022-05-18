export type FontStyleTypes =
  | "paragraph"
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "heading5"
  | "heading6";

export const fontStyle: FontStyleTypes[] = [
  "paragraph",
  "heading1",
  "heading2",
  "heading3",
  "heading4",
  "heading5",
  "heading6"
];

export const is = (s: string): s is FontStyleTypes =>
  fontStyle.includes(s as FontStyleTypes);
