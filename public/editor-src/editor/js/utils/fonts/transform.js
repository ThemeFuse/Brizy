import { produce } from "immer";
import { getUploadedFonts } from "visual/utils/api";
import { getGoogleFonts } from "visual/utils/fonts";
import { t } from "visual/utils/i18n";
import { uuid } from "visual/utils/uuid";

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

/**
 * Normalize Fonts function
 * @param {Object} obj - props
 * @param {Object} obj.newFonts - newFonts
 * @param {Object} obj.config - ConfigCommon
 * @param {string} obj.renderContext - RenderType: "editor" | "view"
 */
export const normalizeFonts = async ({ newFonts, config, renderContext }) => {
  if (newFonts.length === 0) {
    return [];
  }

  const fonts = new Map();
  const makeFontWithId = (font) => ({ brizyId: uuid(), ...font });

  let uploadedFonts = [];
  try {
    uploadedFonts = await getUploadedFonts(config);
  } catch (e) {
    console.log(e);
  }

  const googleFonts = await getGoogleFonts({ config, renderContext });

  newFonts.forEach(({ type, family }) => {
    if (type === "google") {
      const normalizeFont = findFonts(googleFonts, family);

      if (normalizeFont) {
        const currentFonts = fonts.get("blocks") || [];

        fonts.set("blocks", [...currentFonts, makeFontWithId(normalizeFont)]);
      }
    }
    if (type === "upload") {
      const normalizeFont = findFonts(uploadedFonts, family, "upload");

      if (normalizeFont) {
        const currentFonts = fonts.get("upload") || [];

        fonts.set("upload", [...currentFonts, makeFontWithId(normalizeFont)]);
      }
    }

    // has problems with RichText
    // old blocks sometime don't have type
    if (type === "unknowns") {
      const normalizeFont = findFonts(uploadedFonts, family, "upload");

      if (normalizeFont) {
        const currentFonts = fonts.get("upload") || [];

        fonts.set("upload", [...currentFonts, makeFontWithId(normalizeFont)]);
      } else {
        const normalizeFont = findFonts(googleFonts, family);

        if (normalizeFont) {
          const currentFonts = fonts.get("blocks") || [];

          fonts.set("blocks", [...currentFonts, makeFontWithId(normalizeFont)]);
        }
      }
    }
  });

  return Object.values([...fonts]).reduce((acc, curr) => {
    const [type, fonts] = curr;
    return [...acc, { type, fonts }];
  }, []);
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
