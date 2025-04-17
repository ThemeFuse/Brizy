import { Arr, Bool, Str } from "@brizy/readers";
import { mPipe, or } from "fp-utilities";
import { TypographyProps } from "visual/component/Controls/Typography/types/Props";
import { OptionValue } from "visual/component/Options/types";
import { GetConfig } from "visual/providers/ConfigProvider/types";
import { RenderType } from "visual/providers/RenderProvider";
import { currentStyleSelector } from "visual/redux/selectors";
import {
  extraFontStylesSelector,
  unDeletedFontsSelector
} from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import { TextScripts } from "visual/types/Style";
import { getDefaultFont } from "visual/utils/fonts/getFontById";
import { t } from "visual/utils/i18n";
import { TypographyValues } from "visual/utils/options/Typography/types";
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

const readBoolOrStr = or(Bool.read, Str.read);

export const getTypographyValues = ({
  device,
  state,
  store,
  value: v,
  renderContext,
  getConfig
}: {
  device: ResponsiveMode;
  state: State;
  store: Store;
  value: OptionValue<"typography">;
  renderContext: RenderType;
  getConfig: GetConfig;
}): TypographyValues => {
  const reduxState = store.getState();
  const fontsData = {
    fonts: unDeletedFontsSelector(reduxState),
    fontStyles: currentStyleSelector(reduxState).fontStyles,
    extraFontStyles: extraFontStylesSelector(reduxState),
    defaultFont: getDefaultFont(reduxState)
  };

  const { fontStyle, fontFamilyType } = v;
  const data = { v, device, state, fontsData, store, getConfig };

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

  const bold = readBoolOrStr(styleTextTransformBold(data)) ?? false;

  const italic = readBoolOrStr(styleTextTransformItalic(data)) ?? false;

  const textDecoration = Str.read(styleTextTransformTextDecoration(data)) ?? "";

  const textTransform = Str.read(styleTextTransformUpperLowerCase(data)) ?? "";

  return {
    fontStyle,
    fontFamilyType,
    fontFamily,
    fontSize,
    fontSizeSuffix,
    fontWeight,
    bold,
    italic,
    lineHeight,
    letterSpacing,
    variableFontWeight,
    textDecoration,
    textTransform
  };
};

export function readTextTransformValue(
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
