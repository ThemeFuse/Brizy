import deepmerge from "deepmerge";
import { addDefaults } from "timm";
import { ChoicesSync } from "visual/component/Options/types/dev/Select/types";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Response } from "visual/global/Config/types/configs/common";
import { overwriteMerge } from "../utils";
import { getCollectionSourceItems } from "./utils.wp";

export const getSourceItems = <C extends ConfigCommon>(config: C): C => {
  const { api = {} } = config;

  const handler = async (
    res: Response<ChoicesSync>,
    rej: Response<string>,
    args: { id: string }
  ) => {
    try {
      const data = await getCollectionSourceItems(args.id, config);

      const items = data.posts.map(
        ({ ID, title }: { ID: string; title: string }) => ({ value: ID, title })
      );

      res(items);
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
