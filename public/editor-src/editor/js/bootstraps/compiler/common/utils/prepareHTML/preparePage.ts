import {
  ConfigCommon,
  PublishedPage
} from "visual/global/Config/types/configs/ConfigCommon";
import { blocksHtmlRawSelector } from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import { Page } from "visual/types/Page";
import { assetManager } from "../../assetManager";
import { getRootAttr, getRootClassNames } from "./utils";

export function preparePage(
  page: Page,
  config: ConfigCommon,
  store: Store
): PublishedPage {
  const { compiler } = config;
  const state = store.getState();
  const blocksHtml = blocksHtmlRawSelector(state);
  const rootClassNames = getRootClassNames(config);
  const rootAttributes = getRootAttr(config, store);

  if (compiler?.assets === "html") {
    const compiled = {
      blocks: blocksHtml.map((item) => {
        if ("assets" in item && item.html) {
          const assets = assetManager(item.assets);
          return {
            id: item.id,
            html: item.html,
            ...assets
          };
        }

        return { id: item.id };
      }),
      rootClassNames,
      rootAttributes
    };

    return { ...page, compiled };
  }

  const compiled = {
    blocks: blocksHtml,
    rootClassNames,
    rootAttributes
  };
  return { ...page, compiled };
}
