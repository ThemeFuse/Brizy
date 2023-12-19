import EditorComponents from "visual/global/Editor";
import { MValue } from "visual/utils/value";
import { ElementDefaultValue } from "visual/component/Elements/Types";

export type FontType = "google" | "upload" | "system" | "unknowns";

export type Font = {
  type: FontType;
  family: string;
};

export const splitFont = ({ type, family }: Font): string =>
  `${type}|${family}`;

export const unSplitFont = (font: string): Font => {
  const [type, family] = font.split("|");
  return { type, family } as Font;
};

export const getComponentDefaultValue = (
  type: string
): MValue<ElementDefaultValue> => {
  const component = EditorComponents.getComponent(type);
  return component ? component.defaultValue : undefined;
};
