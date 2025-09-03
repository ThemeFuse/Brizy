import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { RenderType } from "visual/providers/RenderProvider";
import { UploadedFont } from "visual/types/Fonts";
import { FontFamilyType } from "visual/types/Fonts";
import { getUploadedFonts } from "visual/utils/api";
import { getGoogleFonts } from "visual/utils/fonts/getGoogleFonts";
import { uuid } from "visual/utils/uuid";
import { findFonts } from "./transform";

interface FontModel {
  type: FontFamilyType | "unknowns";
  family: string;
}

interface Data {
  newFonts: Array<FontModel>;
  config: ConfigCommon;
  renderContext: RenderType;
}

type Types = "blocks" | "upload" | "google";

export const normalizeFonts = async ({
  newFonts,
  config,
  renderContext
}: Data) => {
  if (newFonts.length === 0) {
    return [];
  }

  const fonts = new Map<Types, Array<FontModel & { brizyId: string }>>();
  const makeFontWithId = (font: FontModel) => ({ brizyId: uuid(), ...font });
  const uploadedFontsIds = newFonts
    .filter((f) => f.type === "upload")
    .map((f) => f.family);

  let uploadedFonts: Array<UploadedFont> = [];
  try {
    uploadedFonts = await getUploadedFonts(config, uploadedFontsIds);
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

  return Object.values([...fonts]).reduce(
    (acc, curr) => {
      const [type, fonts] = curr;
      return [...acc, { type, fonts }];
    },
    [] as Array<{ type: Types; fonts: Array<FontModel & { brizyId: string }> }>
  );
};
