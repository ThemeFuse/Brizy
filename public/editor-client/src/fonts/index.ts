import { request } from "../api";
import { makeUrl } from "../api/utils";
import { getConfig } from "../config";
import { Response } from "../types/Response";
import { t } from "../utils/i18n";

interface Family {
  id: string;
  name: string;
  slug: string;
  css_names: string[];
  variations: string[];
}

interface KitData {
  kit: {
    id: string;
    families: Family[];
  };
}

interface Font {
  id: string;
  family: string;
  category: string;
  kind: string;
  subsets: string[];
  variants: string[];
}

interface Fonts {
  kit: {
    id: string;
    families: Font[];
  };
}

function convertDataToLocal(mockTypeKitData: KitData): Fonts {
  const fonts: Fonts = {
    kit: {
      id: mockTypeKitData.kit.id,
      families: []
    }
  };

  mockTypeKitData.kit.families.forEach((family) => {
    fonts.kit.families.push({
      id: family.id,
      family: family.name,
      category: family.slug,
      kind: "webfonts#webfont",
      subsets: [family.css_names[0]],
      variants: family.variations
    });
  });

  return fonts;
}

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
