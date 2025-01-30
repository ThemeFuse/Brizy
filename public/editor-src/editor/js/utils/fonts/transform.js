import { produce } from "immer";
import { t } from "visual/utils/i18n";

const normalizeWeights = (weights) => {
  return weights.reduce(
    (acc, curr) => {
      const toNumber = parseInt(curr); // "100italic => 100";

      return isNaN(toNumber) || acc.includes(toNumber)
        ? acc
        : [...acc, toNumber];
    },
    [400]
  );
};

const tripId = (str) => str.toLowerCase().replace(/\s+/g, "_");

export const findFonts = (fonts = [], fontId = "", type = "google") => {
  if (type === "upload") {
    return fonts.find(({ id }) => id === fontId);
  }

  return fonts.find(({ family }) => tripId(family) === fontId);
};

export const projectFontsData = (projectFonts) => {
  return Object.entries(projectFonts).reduce((acc, curr) => {
    const [type, { data }] = curr;

    switch (type) {
      case "adobe":
        return { ...acc, adobe: data };
      case "upload":
        return { ...acc, upload: data };
      case "system":
        return { ...acc, system: data };
      default:
        return { ...acc, google: [...(acc.google || []), ...data] };
    }
  }, {});
};

export const getGoogleFontDetails = (font) => {
  const { family, category, variants, brizyId, deleted } = font;

  return {
    id: tripId(family),
    title: family,
    // category => sans-serif, serif
    family: `'${family}', ${category}`,
    weights: normalizeWeights(variants),

    // Extra Data
    ...(brizyId && { brizyId }),
    ...(deleted && { deleted })
  };
};

export const getAdobeFontDetails = (font) => {
  const { family, category, variants, brizyId, deleted } = font;
  return {
    id: tripId(family),
    title: family,
    family: `'${family}', ${category}`,
    weights: normalizeWeights(variants),

    // Extra Data
    ...(brizyId && { brizyId }),
    ...(deleted && { deleted })
  };
};

export const getUploadFontDetails = (font) => {
  const { id, family, weights, brizyId, deleted, variations } = font;

  return {
    id,
    title: family,
    family: `'${id}'`,
    weights: normalizeWeights(weights),

    // Extra Data
    ...(brizyId && { brizyId }),
    ...(deleted && { deleted }),
    ...(variations && { variations })
  };
};

export const getSystemDetails = (font) => {
  const { id, weights } = font;

  return {
    id,
    title: t("Default system font"),
    family: id,
    weights: normalizeWeights(weights)
  };
};

export const fontTransform = {
  config: getGoogleFontDetails,
  google: getGoogleFontDetails,
  blocks: getGoogleFontDetails,
  upload: getUploadFontDetails,
  adobe: getAdobeFontDetails,
  system: getSystemDetails
};

export const normalizeStyles = (styles) => {
  return produce(styles, (draft) => {
    draft.map(({ fontStyles }) => normalizeFontStyles(fontStyles));
  });
};

export const normalizeFontStyles = (fontStyles) => {
  return produce(fontStyles, (draft) => {
    draft.map((style) => {
      if (!style.fontSizeSuffix) {
        style.fontSizeSuffix = "px";
      }
      if (!style.tabletFontSizeSuffix) {
        style.tabletFontSizeSuffix = "px";
      }
      if (!style.mobileFontSizeSuffix) {
        style.mobileFontSizeSuffix = "px";
      }
    });
  });
};
