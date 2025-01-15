import { Arr } from "@brizy/readers";
import { mPipe } from "fp-utilities";
import { TypographyProps } from "visual/component/Controls/Typography/types/Props";
import { OptionValue } from "visual/component/Options/types";
import { RenderType } from "visual/providers/RenderProvider";
import { currentStyleSelector } from "visual/redux/selectors";
import {
  extraFontStylesSelector,
  unDeletedFontsSelector
} from "visual/redux/selectors-new";
import { Store } from "visual/redux/store";
import { TextScripts } from "visual/types";
import { getDefaultFont } from "visual/utils/fonts";
import { t } from "visual/utils/i18n";
import { TypographyValues } from "visual/utils/options/Typography/types";
import * as Bool from "visual/utils/reader/bool";
import * as Str from "visual/utils/reader/string";
import * as Union from "visual/utils/reader/union";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";
import { MValue } from "visual/utils/value";
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

export const getTypographyValues = ({
  device,
  state,
  store,
  value: v,
  renderContext
}: {
  device: ResponsiveMode;
  state: State;
  store: Store;
  value: OptionValue<"typography">;
  renderContext: RenderType;
}): TypographyValues => {
  const reduxState = store.getState();
  const fontsData = {
    fonts: unDeletedFontsSelector(reduxState),
    fontStyles: currentStyleSelector(reduxState).fontStyles,
    extraFontStyles: extraFontStylesSelector(reduxState),
    defaultFont: getDefaultFont(reduxState)
  };

  const { fontStyle, fontFamilyType } = v;
  const data = { v, device, state, fontsData, store };

  const fontFamily = styleTypographyFontFamily({
    ...data,
    renderContext
  });

  const fontSize = styleTypographyFontSize(data);

  const fontSizeSuffix = styleTypographyFontSizeSuffix(data);

  const fontWeight = styleTypographyFontWeight(data);

  const lineHeight = styleTypographyLineHeight(data);

  const letterSpacing = styleTypographyLetterSpacing(data);

  const variableFontWeight = styleTypography2FontVariation(data);

  const bold = styleTextTransformBold(data);
  const boldValue = readTextTransformValue(bold, "bold");

  const italic = styleTextTransformItalic(data);
  const textStyle = readTextTransformValue(italic, "italic");

  const textDecoration = styleTextTransformTextDecoration(data);

  const textTransform = styleTextTransformUpperLowerCase(data);

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
