import { ChoicesSync } from "src/types/Choices";
import { VISUAL_CONFIG } from "src/types/global";
import { t } from "src/utils/i18n";
import { MValue } from "src/utils/types";

export const getCollectionTypes = (): MValue<ChoicesSync> => {
  let config: VISUAL_CONFIG | undefined = undefined;

  if (window.__VISUAL_CONFIG__) {
    config = window.__VISUAL_CONFIG__;
  }

  if (!config) {
    throw new Error(t("Missing editor config"));
  }

  const postLoopSources = config?.wp?.postLoopSources;

  if (postLoopSources && Array.isArray(postLoopSources)) {
    return (postLoopSources ?? []).map(({ label, name }) => ({
      title: label,
      value: name
    }));
  }

  return undefined;
};
