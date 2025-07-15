import { isCloud } from "visual/global/Config/types";
import {
  ConfigCommon,
  PublishedGlobalBlock
} from "visual/global/Config/types/configs/ConfigCommon";
import { globalBlocksHTMLInPageSelector } from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import { GlobalBlock } from "visual/types/GlobalBlock";
import { stringifyGlobalBlock } from "visual/utils/api/adapter";
import { assetManager } from "../../assetManager";

export function prepareGlobalBlocks(
  globalBlocks: Array<GlobalBlock>,
  config: ConfigCommon,
  store: Store
): Array<PublishedGlobalBlock> {
  const { compiler } = config;
  const state = store.getState();
  const htmls = globalBlocksHTMLInPageSelector(state, config);
  const is_cloud = isCloud(config);

  return globalBlocks.map((globalBlock) => {
    const toApi = stringifyGlobalBlock(globalBlock, is_cloud);
    const compiled = htmls[globalBlock.uid];
    const blockHtml = {
      id: globalBlock.uid,
      ...compiled
    };

    if (compiler?.assets === "html" && compiled) {
      if ("assets" in compiled && compiled.html) {
        const assets = assetManager(compiled.assets);

        return {
          ...toApi,
          compiled: {
            blocks: [{ ...blockHtml, ...compiled, ...assets }]
          }
        };
      }

      return toApi;
    }

    return {
      ...toApi,
      compiled: {
        blocks: [blockHtml]
      }
    };
  });
}
