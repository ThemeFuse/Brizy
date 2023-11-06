import deepmerge from "deepmerge";
import { addDefaults } from "timm";
import { ChoicesSync } from "visual/component/Options/types/dev/Select/types";
import { isCloud } from "visual/global/Config/types";
import { isShopifyShop } from "visual/global/Config/types/configs/Base";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Response } from "visual/global/Config/types/configs/common";
import { overwriteMerge } from "../../utils";
import { getShopifyBlogPostMeta } from "../utils";

export const getBlogPostMeta = <C extends ConfigCommon>(config: C): C => {
  if (isCloud(config) && isShopifyShop(config.modules?.shop)) {
    const shopModules = config.modules?.shop.api || {};

    const handler = async (
      res: Response<ChoicesSync>,
      rej: Response<string>,
      args: { sourceType: string }
    ) => {
      try {
        const { data } = await getShopifyBlogPostMeta(
          { sourceType: args.sourceType },
          config
        );
        const items = [
          { title: "Auto", value: "" },
          ...data.map(({ id, title }: { id: string; title: string }) => ({
            value: id,
            title
          }))
        ];
        res(items as ChoicesSync);
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          console.log("ERROR: ", e);
        }
        rej("Something went wrong");
      }
    };

    const shopAPI = {
      blogPostMetaLoad: {
        handler
      }
    };

    const defaultShopAPI = addDefaults(shopModules, shopAPI);
    const _modules = deepmerge(defaultShopAPI, shopModules, {
      arrayMerge: overwriteMerge
    });

    return Object.assign(config, {
      modules: {
        ...config.modules,
        shop: { ...config.modules?.shop, api: _modules }
      }
    });
  }

  return config;
};
