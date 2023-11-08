import { request } from "../api";
import { getConfig } from "../config";
import { Response } from "../types/Response";
import { t } from "../utils/i18n";

// const mockTypeKitData = {
//   kit: {
//     id: "gvs0pdl",
//     families: [
//       {
//         id: "gev",
//         name: "Utopia Std Headline",
//         slug: "utopia-std-headline",
//         css_names: ["utopia-std-headline"],
//         css_stack: '"utopia-std-headline",serif',
//         variations: ["n4"]
//       }
//     ]
//   }
// };

// const fonts = {
//   kit: {
//     id: "gvs4g55",
//     families: [
//       {
//         id: "kfjie",
//         family: "Aloha3 style",
//         category: "aloha-style",
//         kind: "webfonts#webfont",
//         subsets: ["aloha-style"],
//         variants: ["n4"]
//       }
//     ]
//   }
// };

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

// const headers = {
//   Accept: "application/json",
//   "Content-Type": "application/json",
// Origin: `${location.href}/`
//   "X-Requested-With": "XMLHttpRequest",
// Referer: `${location.href}/`
// };

export const getAdobeFonts = {
  async handler(
    res: Response<unknown>,
    rej: Response<string>,
    extra: { kitId: string }
  ) {
    const config = getConfig();

    if (!config) {
      throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
    }

    const r = await request(config.actions.adobeFontsUrl, {
      method: "GET"
    });

    if (r.ok) {
      res(convertDataToLocal(await r.json()));
    } else {
      rej("Failed to get adobe fonts");
    }
  }
};

// export const getAdobeFonts = {
//   async handler(
//     res: Response<Fonts>,
//     rej: Response<string>,
//     extra: { kitId: string }
//   ) {
//     console.log("KITID: ", extra.kitId);
//     if (true) {
//       res(convertDataToLocal(mockTypeKitData));
//     } else {
//       rej("Failed to get fonts");
//     }
//   }
// };
