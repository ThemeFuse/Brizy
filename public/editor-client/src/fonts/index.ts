import { addAdobeAccount, getAdobeFont } from "../api";
import { AdobeFonts } from "../types/AdobeFonts";
import { t } from "../utils/i18n";
import { Fonts, KitData } from "./types";
import { FontsData, getUploadedFonts } from "../api";
import { Response } from "../types/Response";

const convertDataToLocal = (mockTypeKitData: KitData): Fonts => {
  const families = mockTypeKitData.kit.families.map((family) => ({
    id: family.id,
    family: family.name,
    category: family.slug,
    kind: "webfonts#webfont",
    subsets: [family.css_names[0]],
    variants: family.variations
  }));

  return {
    kit: {
      id: mockTypeKitData.kit.id,
      families
    }
  };
};

export const adobeFont = (): AdobeFonts => {
  return {
    async get(res, rej) {
      try {
        const r = await getAdobeFont();
        res(convertDataToLocal(r));
      } catch (e) {
        rej(t("Failed to get AdobeFont"));
      }
    },
    async add(res, rej, extra) {
      try {
        const r = await addAdobeAccount(extra);
        res(r);
      } catch (e) {
        rej(t("Failed to add Adobe account"));
      }
    }
  };
};
export const uploadedFonts = {
  async get(res: Response<Array<FontsData>>, rej: Response<string>) {
    try {
      const r = await getUploadedFonts();
      res(r);
    } catch (e) {
      rej(`Fonts Error: ${e}`);
    }
  }
};
