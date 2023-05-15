import deepmerge from "deepmerge";
import { addDefaults } from "timm";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { t } from "visual/utils/i18n";
import { overwriteMerge } from "../utils";
import { getCollectionSourceTypes } from "./utils";

export const getSourceChoices = <C extends ConfigCommon>(config: C): C => {
  const { api = {} } = config;

  const loadSourceTypes = async () => {
    const sourceTypes = await getCollectionSourceTypes(config);
    return [
      { title: "None", value: "" },
      ...sourceTypes.map((item) => ({ title: item.title, value: item.id }))
    ];
  };

  const newApi = {
    sourceTypes: {
      getSourceChoices: () => ({
        load: loadSourceTypes,
        emptyLoad: {
          title: t("There are no choices")
        }
      })
    }
  };

  const defaultAPI = addDefaults(api, newApi);
  const _api = deepmerge(defaultAPI, api, { arrayMerge: overwriteMerge });

  return Object.assign(config, { api: _api });
};
