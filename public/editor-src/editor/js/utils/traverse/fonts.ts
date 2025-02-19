import {
  ElementModel,
  ElementModelType
} from "visual/component/Elements/Types";
import { Block } from "visual/types/Block";
import {
  AdobeFont,
  Fonts,
  GoogleFont,
  SystemFont,
  UploadedFont
} from "visual/types/Fonts";
import { FontFamilyType } from "visual/types/Fonts";
import { GlobalBlock } from "visual/types/GlobalBlock";
import { FontStyle } from "visual/types/Style";
import { findFonts, projectFontsData } from "visual/utils/fonts/transform";
import * as Str from "visual/utils/reader/string";
import { modelTraverse, styleTraverse } from "visual/utils/traverse";
import {
  Font,
  FontType,
  getComponentDefaultValue,
  getRichTextFamilies,
  splitFont,
  unSplitFont
} from "./common";

type Models = Block | ElementModel | Array<ElementModelType>;

type GetUsedModelsFonts = (data: {
  models: Models;
  globalBlocks?: Record<string, GlobalBlock>;
}) => Font[];

const getModelFonts = ({ type, value }: ElementModelType): Array<Font> => {
  const defaultStyle = getComponentDefaultValue(type)?.style || {};
  const style = { ...defaultStyle, ...value };
  const fonts: Array<Font> = [];

  Object.entries(defaultStyle.families || {}).forEach((fontKeys) => {
    const [key, keyValue] = fontKeys;
    const fontStyle = key.replace("Family", "Style");

    // if exist fontStyle don't need current fontFamily
    // in this case fontFamily is global
    if (style[fontStyle]) {
      return;
    }

    const font = {
      type: Str.read(value[`${key}Type`] || defaultStyle[`${key}Type`]) as
        | FontType
        | undefined,
      family: Str.read(value[key] || keyValue)
    };

    if (font.type && font.family) {
      fonts.push({ type: font.type, family: font.family });
    }
  });

  return fonts;
};

export const getUsedModelsFonts: GetUsedModelsFonts = ({
  models = {},
  globalBlocks = {}
}) => {
  const fontFamilies = new Set<string>();

  modelTraverse(models, {
    Component({ type, value }: ElementModelType) {
      const fonts = getModelFonts({ type, value });
      fonts.forEach((font) => {
        fontFamilies.add(splitFont(font));
      });
    },

    RichText({ type, value }: ElementModelType) {
      const defaultValue = getComponentDefaultValue(type)?.content || {};

      const style = { ...defaultValue, ...value };
      const text = Str.read(value.text || defaultValue.text);

      if (style.textPopulation) {
        const fonts = getModelFonts({ type, value });
        fonts.forEach((font) => {
          fontFamilies.add(splitFont(font));
        });
      } else {
        if (text) {
          const fonts = getRichTextFamilies(text);

          fonts.forEach((font) => {
            fontFamilies.add(splitFont(font));
          });
        }
      }
    },
    GlobalBlock({ value: { _id } }: ElementModelType) {
      const id = Str.read(_id);
      const globalBlockValue = id ? globalBlocks[id] : undefined;

      if (globalBlockValue) {
        const models = { models: globalBlockValue.data, globalBlocks };

        getUsedModelsFonts(models).forEach((font) => {
          fontFamilies.add(splitFont(font));
        });
      }
    }
  });

  return [...fontFamilies].map(unSplitFont);
};

type GetUsedStylesFonts = (styles: Array<FontStyle>) => Font[];

export const getUsedStylesFonts: GetUsedStylesFonts = (styles) => {
  const fontFamilies = new Set<string>();

  styles.forEach((fontStyle) => {
    styleTraverse(fontStyle, {
      fontFamily(value: string) {
        fontFamilies.add(
          splitFont({
            type: fontStyle["fontFamilyType"] ?? "google",
            family: value
          })
        );
      }
    });
  });

  return [...fontFamilies].map(unSplitFont);
};

interface FontModel {
  type: FontFamilyType | "unknowns";
  family: string;
}

type GetBlocksStylesFonts = (
  fonts: Array<Font>,
  projectFonts: Fonts
) => Array<FontModel>;

export const getBlocksStylesFonts: GetBlocksStylesFonts = (
  fonts,
  projectFonts_
) => {
  const uniqFonts = fonts.reduce((acc, curr) => {
    return acc.some(({ family }) => family === curr.family)
      ? acc
      : [...acc, curr];
  }, [] as Font[]);

  // @ts-expect-error: Need transform to ts
  const projectFonts: {
    google: GoogleFont[];
    upload: UploadedFont[];
    adobe: AdobeFont[];
    system: SystemFont[];
  } = projectFontsData(projectFonts_);

  return uniqFonts.reduce((acc, curr) => {
    const { type, family } = curr;

    switch (type) {
      // find in all project -> fonts
      case "unknowns": {
        return Object.entries(projectFonts).find(([type, data]) =>
          findFonts(data, family, type)
        )
          ? acc
          : ([...acc, curr] as FontModel[]);
      }
      case "google":
      case "system":
      case "adobe":
      case "upload": {
        return findFonts(projectFonts[type], family, type)
          ? acc
          : ([...acc, curr] as FontModel[]);
      }
    }
  }, [] as Array<FontModel>);
};
