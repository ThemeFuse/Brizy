import { assetUrl } from "visual/utils/asset";
import { t } from "visual/utils/i18n";

const fetchItems = async (url: string) => {
  const data = await fetch(url);
  const { items } = await data.json();

  return items;
};

export const getGoogleFonts = async () => {
  return new Promise((res, rej) => {
    if (IS_EDITOR || COMPILER_TYPE === "worker") {
      try {
        (async () => {
          const fonts = await fetchItems(assetUrl("googleFonts.json"));
          res(fonts);
        })();
      } catch (e) {
        rej(t("Missing google fonts json"));
      }
    }

    if (IS_PREVIEW && COMPILER_TYPE === "node") {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fonts = require("visual/config/googleFonts.json");
      return res(fonts);
    }
  });
};
