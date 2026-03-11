import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { GoogleFont } from "visual/types/Fonts";
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
    try {
      (async () => {
        const fonts = await fetchItems(assetUrl("googleFonts.json", config));
        res(fonts);
      })();
    } catch (_) {
      rej(t("Missing google fonts json"));
    }
  });
};
