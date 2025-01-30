import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { FontStyle } from "visual/types/Style";
import { makeStyleCSSVar } from "visual/utils/fonts/makeGlobalStylesTypography";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";

export const FONT_INITIAL = "initial";
export const systemFont = [
  {
    brizyId: "txQIADKLhSs7",
    id: FONT_INITIAL,
    family: FONT_INITIAL,
    category: "default_system_font",
    weights: ["normal"]
  }
];

export const makeGlobalStylesTextTransform = (
  {
    bold,
    italic,
    underline,
    strike,
    uppercase,
    lowercase,
    fontWeight,
    tabletFontWeight,
    mobileFontWeight,
    id
  }: Partial<FontStyle> & { id: string },
  config: ConfigCommon
): string => {
  const boldValue = bold ? "bold" : fontWeight;
  const mobileBoldValue = bold ? "bold" : mobileFontWeight;
  const tabletBoldValue = bold ? "bold" : tabletFontWeight;
  const italicValue = italic ? "italic" : "inherit";
  const uppercaseValue = uppercase ? "uppercase" : "";
  const lowercaseValue = lowercase ? "lowercase" : "";

  const textDecorationValue =
    `${underline ? "underline" : ""} ${strike ? "line-through" : ""}`.trim() ||
    "inherit";

  const textTransformValue = uppercaseValue || lowercaseValue || "inherit";

  const boldKey = makeStyleCSSVar({
    id,
    config,
    key: "bold",
    device: DESKTOP
  });
  const italicKey = makeStyleCSSVar({
    id,
    config,
    key: "italic",
    device: DESKTOP
  });
  const textDecorationKey = makeStyleCSSVar({
    id,
    config,
    key: "textDecoration",
    device: DESKTOP
  });
  const textTransformKey = makeStyleCSSVar({
    id,
    config,
    key: "textTransform",
    device: DESKTOP
  });

  const tabletBoldKey = makeStyleCSSVar({
    id,
    config,
    key: "bold",
    device: TABLET
  });
  const tabletItalicKey = makeStyleCSSVar({
    id,
    config,
    key: "italic",
    device: TABLET
  });
  const tabletTextTransformKey = makeStyleCSSVar({
    id,
    config,
    key: "textTransform",
    device: TABLET
  });
  const tabletTextDecorationKey = makeStyleCSSVar({
    id,
    config,
    key: "textDecoration",
    device: TABLET
  });

  const mobileBoldKey = makeStyleCSSVar({
    id,
    config,
    key: "bold",
    device: MOBILE
  });
  const mobileItalicKey = makeStyleCSSVar({
    id,
    config,
    key: "italic",
    device: MOBILE
  });
  const mobileTextDecorationKey = makeStyleCSSVar({
    id,
    config,
    key: "textDecoration",
    device: MOBILE
  });
  const mobileTextTransformKey = makeStyleCSSVar({
    id,
    config,
    key: "textTransform",
    device: MOBILE
  });

  return `
    ${boldKey}:${boldValue};
    ${italicKey}:${italicValue};
    ${textDecorationKey}:${textDecorationValue};
    ${textTransformKey}:${textTransformValue};
    ${tabletBoldKey}:${tabletBoldValue};
    ${tabletItalicKey}:${italicValue};
    ${tabletTextDecorationKey}:${textDecorationValue};
    ${tabletTextTransformKey}:${textTransformValue};
    ${mobileBoldKey}:${mobileBoldValue};
    ${mobileItalicKey}:${italicValue};
    ${mobileTextDecorationKey}:${textDecorationValue};
    ${mobileTextTransformKey}:${textTransformValue};
  `;
};
