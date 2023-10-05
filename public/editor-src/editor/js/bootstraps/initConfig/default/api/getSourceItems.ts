import deepmerge from "deepmerge";
import { addDefaults } from "timm";
import { ChoicesSync } from "visual/component/Options/types/dev/Select/types";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Response } from "visual/global/Config/types/configs/common";
import { overwriteMerge } from "../utils";
import {
  getCollectionSourceItemsById,
  getCollectionSourceItemsByType
} from "./utils";

export const getSourceItems = <C extends ConfigCommon>(config: C): C => {
  const { api = {} } = config;

  if (isCloud(config) && isShopify(config)) {
    const handler = async (
      res: Response<ChoicesSync>,
      rej: Response<string>,
      args: { id: string }
    ) => {
      try {
        const data = await getCollectionSourceItemsByType(
          { slug: args.id },
          config
        );

        const items = [
          { title: "None", value: "" },
          ...data.map(({ id, title }) => ({ value: id, title: title }))
        ];

        res(items as ChoicesSync);
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          console.log("ERROR: ", e);
        }

        rej("Something went wrong");
      }
    };

    const newApi = {
      sourceItems: {
        handler
      }
    };

    const defaultAPI = addDefaults(api, newApi);
    const _api = deepmerge(defaultAPI, api, { arrayMerge: overwriteMerge });

    return Object.assign(config, { api: _api });
  }

  const handler = async (
    res: Response<ChoicesSync>,
    rej: Response<string>,
    args: { id: string }
  ) => {
    try {
      const data = await getCollectionSourceItemsById({ id: args.id }, config);
      const items = data.map(({ id, title }) => ({
        value: id,
        title: title
      }));

      res(items as ChoicesSync);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error(e);
      }

      rej("Something went wrong");
    }
  };

  const newApi = {
    sourceItems: {
      handler
    }
  };

  const defaultAPI = addDefaults(api, newApi);
  const _api = deepmerge(defaultAPI, api, { arrayMerge: overwriteMerge });

  return Object.assign(config, { api: _api });
};
