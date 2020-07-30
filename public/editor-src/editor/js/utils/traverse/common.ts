import EditorComponents from "visual/global/Editor";
import { Block } from "visual/types";

type FontType = "google" | "upload";

type Font = {
  type: FontType;
  family: string;
};

export const splitFont = ({ type, family }: Font): string =>
  `${type}|${family}`;

export const unSplitFont = (font: string): Font => {
  const [type, family] = font.split("|");
  return { type, family } as Font;
};

export const getComponentDefaultValue = (type: string): Block["value"] => {
  const component = EditorComponents.getComponent(type);
  return component ? component.defaultValue : {};
};
