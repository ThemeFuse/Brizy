import { OptionValue } from "visual/component/Options/types";
import { currentStyleSelector } from "visual/redux/selectors";
import {
  extraFontStylesSelector,
  unDeletedFontsSelector
} from "visual/redux/selectors-new";
import { getStore } from "visual/redux/store";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";
import {
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
  value: v
}: {
  device: ResponsiveMode;
  state: State;
  value: OptionValue<"typography">;
}): Omit<
  OptionValue<"typography">,
  "letterSpacing" | "variableFontWeight" | "fontWidth" | "fontSoftness"
> & {
  letterSpacing: string;
  variableFontWeight: string;
} => {
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

  return {
    fontStyle,
    fontFamilyType,
    fontFamily,
    fontSize,
    fontSizeSuffix,
    fontWeight,
    lineHeight,
    letterSpacing,
    variableFontWeight
  };
};
