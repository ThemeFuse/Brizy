import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { GoogleFont } from "visual/types/Fonts";
import { assetUrl } from "visual/utils/asset";
import { t } from "visual/utils/i18n";

const fetchItems = async (url: string) => {
  const data = await fetch(url);
  const { items } = await data.json();

  return items;
};

export const getGoogleFonts = async ({
  config
}: {
  config: ConfigCommon;
}): Promise<Array<GoogleFont>> => {
  return new Promise((res, rej) => {
    if (COMPILER_TYPE === "worker") {
      try {
        (async () => {
          const fonts = await fetchItems(assetUrl("googleFonts.json", config));
          res(fonts);
        })();
      } catch (_) {
        rej(t("Missing google fonts json"));
      }
    }

    if (COMPILER_TYPE === "node") {
      // biome-ignore lint/style/noCommonJs: COMPILER_TYPE branch — a static import would bundle the 337KB font JSON into every target
      const fonts = require("visual/config/googleFonts.json");
      return res(fonts.items);
    }

    rej(t("Unknow COMPILER_TYPE"));
  });
};
