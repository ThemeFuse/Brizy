import {
  ElementDefaultValue,
  ElementModel
} from "visual/component/Elements/Types";
import { Model } from "visual/editorComponents/EditorComponent/types";
import EditorComponents from "visual/global/Editor";
import { rulesSelector } from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { MValue } from "visual/utils/value";

export type FontType = "google" | "adobe" | "upload" | "system" | "unknowns";

export function isFontType(t: unknown): t is FontType {
  return t === "google" || t === "upload" || t === "system" || t === "unknowns";
}

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

export const getComponentRulesValue = (
  state: ReduxState,
  v: Model<ElementModel>
) => {
  const currentStyleRules: Record<string, ElementModel | undefined> =
    rulesSelector(state);

  if ("_styles" in v && v._styles && currentStyleRules) {
    return v._styles.reduce((acc: Partial<ElementModel>, style: string) => {
      const ruleStyle = currentStyleRules[style];
      return ruleStyle ? Object.assign(acc, ruleStyle) : acc;
    }, {});
  }

  return null;
};

export function getRichTextFamilies(text: string): Array<Font> {
  const clsRgx = /class=(["'])(.+?)\1/g;
  const ftRgx = /brz-ft-(\S+)/g;
  const ffRgx = /brz-ff-(\S+)/g;
  const match = [...text.matchAll(clsRgx)];
  const fonts: Map<string, FontType> = new Map();

  match.forEach((item) => {
    const [, , className] = item;

    if (className) {
      const font: { type?: FontType; family?: string } = {
        type: undefined,
        family: undefined
      };
      const ftMatch = [...className.matchAll(ftRgx)];
      const ffMatch = [...className.matchAll(ffRgx)];

      ftMatch.forEach((item) => {
        const [, type] = item;

        if (isFontType(type)) {
          font.type = type;
        }
      });
      ffMatch.forEach((item) => {
        const [, family] = item;

        if (family) {
          font.family = family;
        }
      });

      if (font.type && font.family) {
        fonts.set(font.family, font.type);
      }
    }
  });

  return [...fonts].map(([family, type]) => ({ type, family }));
}
