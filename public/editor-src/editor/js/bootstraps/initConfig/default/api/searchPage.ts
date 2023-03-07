import deepmerge from "deepmerge";
import { addDefaults } from "timm";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Response } from "visual/global/Config/types/configs/common";
import { overwriteMerge } from "../utils";
import { searchCollectionItems } from "./utils";

export interface Post {
  id: string;
  title: string;
}

export const searchPage = <C extends ConfigCommon>(config: C): C => {
  const { api = {} } = config;

  const handlerSearch = async (
    res: Response<Post[]>,
    rej: Response<string>,
    { id, search }: { id: string; search: string }
  ) => {
    try {
      const items = await searchCollectionItems({ id, search }, config);
      const _items = items?.collection?.map(({ title, permalink }) => ({
        title,
        id: permalink
      }));

      res(_items);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.log("ERROR: ", e);
      }

      rej("Something went wrong");
    }
  };

  const newApi = {
    linkPages: {
      handlerSearch
    }
  };

  const defaultAPI = addDefaults(api, newApi);
  const _api = deepmerge(defaultAPI, api, { arrayMerge: overwriteMerge });

  return Object.assign(config, { api: _api });
};
