import deepmerge from "deepmerge";
import { addDefaults } from "timm";
import { ChoicesSync } from "visual/component/Options/types/dev/Select/types";
import { isCloud } from "visual/global/Config/types";
import { isShopifyShop } from "visual/global/Config/types/configs/Base";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Response } from "visual/global/Config/types/configs/common";
import { overwriteMerge } from "../../utils";
import { getShopifyMetafields } from "../utils";

export const getMetafields = <C extends ConfigCommon>(config: C): C => {
  if (isCloud(config) && isShopifyShop(config.modules?.shop)) {
    const shopModules = config.modules?.shop?.api || {};

    const handler = async (
      res: Response<ChoicesSync>,
      rej: Response<string>,
      args: { sourceType: string }
    ) => {
      try {
        const { data } = await getShopifyMetafields(
          { sourceType: args.sourceType },
          config
        );
        const items = [
          { title: "None", value: "" },
          ...data.map(({ key, name }: { key: string; name: string }) => ({
            value: key,
            title: name
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
      metafieldsLoad: {
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
