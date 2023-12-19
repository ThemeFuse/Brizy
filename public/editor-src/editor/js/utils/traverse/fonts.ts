import {
  ElementModel,
  ElementModelType
} from "visual/component/Elements/Types";
import { mapBlockElements } from "visual/editorComponents/RichText/utils";
import { classNamesToV } from "visual/editorComponents/RichText/utils/transforms";
import {
  Block,
  FontStyle,
  Fonts,
  GlobalBlock,
  GoogleFont,
  SystemFont,
  UploadedFont
} from "visual/types";
import { findFonts, projectFontsData } from "visual/utils/fonts";
import { FontFamilyType } from "visual/utils/fonts/familyType";
import * as Str from "visual/utils/reader/string";
import { modelTraverse, styleTraverse } from "visual/utils/traverse";
import {
  Font,
  FontType,
  getComponentDefaultValue,
  splitFont,
  unSplitFont
} from "./common";

type Models = Block | ElementModel | Array<ElementModelType>;

type GetUsedModelsFonts = (data: {
  models: Models;
  globalBlocks?: Record<string, GlobalBlock>;
}) => Font[];

export const getUsedModelsFonts: GetUsedModelsFonts = ({
  models = {},
  globalBlocks = {}
}) => {
  const fontFamilies = new Set<string>();

  const DCFontFamily = ({ type, value }: ElementModelType): void => {
    const defaultStyle = getComponentDefaultValue(type)?.style || {};
    const style = { ...defaultStyle, ...value };

    Object.entries(defaultStyle.families || {}).forEach((fontKeys) => {
      const [key, keyValue] = fontKeys;
      const font = {
        type: Str.read(value[`${key}Type`] || defaultStyle[`${key}Type`]) as
          | FontType
          | undefined,
        family: Str.read(value[key] || keyValue)
      };
      const fontStyle = key.replace("Family", "Style");

      // if exist fontStyle don't need current fontFamily
      // in this case fontFamily is global
      if (Str.read(style[fontStyle])) {
        return;
      }

      if (font.type && font.family) {
        fontFamilies.add(splitFont({ type: font.type, family: font.family }));
      }
    });
  };

  modelTraverse(models, {
    Component({ type, value }: ElementModelType) {
      DCFontFamily({ type, value });
    },

    RichText({ type, value }: ElementModelType) {
      const defaultValue = getComponentDefaultValue(type)?.content || {};

      const style = { ...defaultValue, ...value };
      const text = value.text || defaultValue.text;

      if (style.textPopulation) {
        DCFontFamily({ type, value });
      } else {
        mapBlockElements(text, (elem: cheerio.Cheerio | JQuery) => {
          const v = classNamesToV(elem.attr("class")?.split(" ") ?? []);
          const { typographyFontFamily, typographyFontFamilyType } = v;

          if (typographyFontFamily) {
            if (typographyFontFamilyType) {
              fontFamilies.add(
                splitFont({
                  type: typographyFontFamilyType as FontType,
                  family: typographyFontFamily as string
                })
              );
            } else {
              // if type doesn't exist
              // set it to unknowns
              // and parse all fonts
              fontFamilies.add(
                splitFont({
                  family: typographyFontFamily as string,
                  type: "unknowns"
                })
              );
            }
          }
        });
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
      case "upload": {
        return findFonts(projectFonts[type], family, type)
          ? acc
          : ([...acc, curr] as FontModel[]);
      }
    }
  }, [] as Array<FontModel>);
};
