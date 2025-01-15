import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { RenderType, isEditor, isView } from "visual/providers/RenderProvider";
import { assetUrl } from "visual/utils/asset";
import { t } from "visual/utils/i18n";

const fetchItems = async (url: string) => {
  const data = await fetch(url);
  const { items } = await data.json();

  return items;
};

export const getGoogleFonts = async ({
  config,
  renderContext
}: {
  config: ConfigCommon;
  renderContext: RenderType;
}) => {
  return new Promise((res, rej) => {
    if (isEditor(renderContext) || COMPILER_TYPE === "worker") {
      try {
        (async () => {
          const fonts = await fetchItems(assetUrl("googleFonts.json", config));
          res(fonts);
        })();
      } catch (e) {
        rej(t("Missing google fonts json"));
      }
    }

    if (isView(renderContext) && COMPILER_TYPE === "node") {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fonts = require("visual/config/googleFonts.json");
      return res(fonts);
    }
  });
};
