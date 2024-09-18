import { OptionValue } from "visual/component/Options/types";
import { currentStyleSelector } from "visual/redux/selectors";
import {
  extraFontStylesSelector,
  unDeletedFontsSelector
} from "visual/redux/selectors-new";
import { getStore } from "visual/redux/store";
import { TypographyValues } from "visual/utils/options/Typography/types";
import * as Bool from "visual/utils/reader/bool";
import * as Str from "visual/utils/reader/string";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";
import {
  styleTextTransformBold,
  styleTextTransformItalic,
  styleTextTransformTextDecoration,
  styleTextTransformUpperLowerCase,
  styleTypography2FontVariation,
  styleTypographyFontFamily,
  styleTypographyFontSize,
  styleTypographyFontSizeSuffix,
  styleTypographyFontWeight,
  styleTypographyLetterSpacing,
  styleTypographyLineHeight
} from "./styleFns";
import { TextScripts } from "visual/types";
import { mPipe } from "fp-utilities";
import { Arr } from "@brizy/readers";
import * as Union from "visual/utils/reader/union";
import { TypographyProps } from "visual/component/Controls/Typography/types/Props";
import { t } from "visual/utils/i18n";
import { MValue } from "visual/utils/value";

export const getTypographyValues = ({
  device,
  state,
  value: v
}: {
  device: ResponsiveMode;
  state: State;
  value: OptionValue<"typography">;
}): TypographyValues => {
  const store = getStore().getState();

  const fontsData = {
    fonts: unDeletedFontsSelector(store),
    fontStyles: currentStyleSelector(store).fontStyles,
    extraFontStyles: extraFontStylesSelector(store)
  };

  const { fontStyle, fontFamilyType } = v;

  const fontFamily = styleTypographyFontFamily({ v, device, state, fontsData });

  const fontSize = styleTypographyFontSize({ v, device, state, fontsData });

  const fontSizeSuffix = styleTypographyFontSizeSuffix({
    v,
    device,
    state,
    fontsData
  });

  const fontWeight = styleTypographyFontWeight({ v, device, state, fontsData });

  const lineHeight = styleTypographyLineHeight({ v, device, state, fontsData });

  const letterSpacing = styleTypographyLetterSpacing({
    v,
    device,
    state,
    fontsData
  });

  const variableFontWeight = styleTypography2FontVariation({
    v,
    device,
    state,
    fontsData
  });

  const bold = styleTextTransformBold({ v, device, state, fontsData });
  const boldValue = readTextTransformValue(bold, "bold");

  const italic = styleTextTransformItalic({ v, device, state, fontsData });
  const textStyle = readTextTransformValue(italic, "italic");

  const textDecoration = styleTextTransformTextDecoration({
    v,
    device,
    state,
    fontsData
  });

  const textTransform = styleTextTransformUpperLowerCase({
    v,
    device,
    state,
    fontsData
  });

  const _textStyle = textStyle ? `font-style:${textStyle};` : "";
  const _textDecoration = textDecoration
    ? `text-decoration:${textDecoration};`
    : "";
  const _textTransform = textTransform
    ? `text-transform:${textTransform};`
    : "";

  return {
    fontStyle,
    fontFamilyType,
    fontFamily,
    fontSize,
    fontSizeSuffix,
    fontWeight: boldValue || fontWeight,
    lineHeight,
    letterSpacing,
    variableFontWeight,
    textStyle: _textStyle,
    textDecoration: _textDecoration,
    textTransform: _textTransform
  };
};

function readTextTransformValue(
  value: unknown,
  transformKey: string
): string | undefined {
  // This check is needed because value can come from global styles as var(--varName)
  if (Bool.read(value)) {
    return value ? transformKey : "";
  }

  return Str.read(value);
}

export const readScripts = mPipe(
  Arr.read,
  Arr.readWithItemReader(
    Union.readWithChoices<TextScripts>([TextScripts.Sub, TextScripts.Super])
  )
);
export const createScriptChoices = (
  v: TextScripts[]
): MValue<TypographyProps["scriptChoices"]> => {
  if (v.length === 0) return;

  const choices = [
    {
      icon: "nc-font",
      title: t("None"),
      value: TextScripts.None
    }
  ];

  v.forEach((script) => {
    switch (script) {
      case TextScripts.Sub:
        choices.push({
          icon: "nc-tp-subscript",
          title: t("Subscript"),
          value: TextScripts.Sub
        });
        break;
      case TextScripts.Super:
        choices.push({
          icon: "nc-tp-superscript",
          title: t("Superscript"),
          value: TextScripts.Super
        });
        break;
    }
  });

  return choices;
};
