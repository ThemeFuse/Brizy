import { request } from "../api";
import { makeUrl } from "../api/utils";
import { getConfig } from "../config";
import { Response } from "../types/Response";
import { t } from "../utils/i18n";
import { Fonts, KitData } from "./types";

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

export const getAdobeFonts = {
  async handler(res: Response<unknown>, rej: Response<string>) {
    const config = getConfig();

    if (!config) {
      throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
    }

    const { editorVersion, url: _url, hash, actions } = config;

    const url = makeUrl(_url, {
      hash,
      action: actions.adobeFontsUrl,
      version: editorVersion
    });

    const r = await request(url, {
      method: "GET"
    });

    if (r.ok) {
      const d = await r.json();

      if (d) {
        res(convertDataToLocal(d.data));
      }
    } else {
      rej("Failed to get adobe fonts");
    }
  }
};
