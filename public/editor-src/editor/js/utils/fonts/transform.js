import { uuid } from "visual/utils/uuid";
import { getGoogleFonts } from "visual/utils/fonts";
import { getUploadedFonts } from "visual/utils/api/editor";

const normalizeWeights = weights => {
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

const tripId = str => str.toLowerCase().replace(/\s+/g, "_");

export const findFonts = (fonts = [], fontId = "", type = "google") => {
  if (type === "upload") {
    return fonts.find(({ id }) => id === fontId);
  }

  return fonts.find(({ family }) => tripId(family) === fontId);
};

export const projectFontsData = projectFonts => {
  return Object.entries(projectFonts).reduce((acc, curr) => {
    const [type, { data }] = curr;

    return type === "upload"
      ? { ...acc, upload: data }
      : { ...acc, google: [...(acc.google || []), ...data] };
  }, {});
};

export const getGoogleFontDetails = font => {
  const { family, category, variants, brizyId, deleted } = font;

  return {
    id: tripId(family),
    title: family,
    family: `${family}, ${category}`, // category => sans-serif, serif
    weights: normalizeWeights(variants),

    // Extra Data
    ...(brizyId && { brizyId }),
    ...(deleted && { deleted })
  };
};

export const getUploadFontDetails = font => {
  const { id, family, weights, brizyId, deleted } = font;

  return {
    id,
    title: family,
    family: `'${id}'`,
    weights: normalizeWeights(weights),

    // Extra Data
    ...(brizyId && { brizyId }),
    ...(deleted && { deleted })
  };
};

export const fontTransform = {
  config: getGoogleFontDetails,
  google: getGoogleFontDetails,
  blocks: getGoogleFontDetails,
  upload: getUploadFontDetails
};

export const normalizeFonts = async newFonts => {
  if (newFonts.length === 0) {
    return [];
  }

  const fonts = new Map();

  const [googleFonts, uploadedFonts] = await Promise.all([
    getGoogleFonts(),
    getUploadedFonts()
  ]);

  newFonts.forEach(({ type, family }) => {
    if (type === "google") {
      const normalizeFont = findFonts(googleFonts, family);
      const font = {
        brizyId: uuid(),
        ...normalizeFont
      };
      const currentFonts = fonts.get("blocks") || [];

      fonts.set("blocks", [...currentFonts, font]);
    }
    if (type === "upload") {
      const normalizeFont = findFonts(uploadedFonts, family, "upload");
      const font = {
        brizyId: uuid(),
        ...normalizeFont
      };
      const currentFonts = fonts.get("upload") || [];

      fonts.set("upload", [...currentFonts, font]);
    }
  });

  return Object.values([...fonts]).reduce((acc, curr) => {
    const [type, fonts] = curr;
    return [...acc, { type, fonts }];
  }, []);
};
