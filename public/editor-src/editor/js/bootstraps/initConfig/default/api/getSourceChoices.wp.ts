import deepmerge from "deepmerge";
import { addDefaults } from "timm";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { overwriteMerge } from "../utils";

export const getSourceChoices = <C extends ConfigCommon>(config: C): C => {
  const { api = {} } = config;

  const newApi = {
    sourceTypes: {
      getSourceChoices: () => {
        return [
          { title: "Not Selected", value: "" },
          // @ts-expect-error this should not be here. Will be removed later
          ...(config?.wp?.postLoopSources ?? []).map(({ label, name }) => ({
            title: label,
            value: name
          }))
        ];
      }
    }
  };

  const defaultAPI = addDefaults(api, newApi);
  const _api = deepmerge(defaultAPI, api, { arrayMerge: overwriteMerge });

  return Object.assign(config, { api: _api });
};
