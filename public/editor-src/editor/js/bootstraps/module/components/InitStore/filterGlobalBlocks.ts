import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { Block } from "visual/types/Block";
import { Page } from "visual/types/Page";
import { canUseCondition } from "visual/utils/blocks/getAllowedGBIds";
import { BlockRecord } from "visual/utils/reader/globalBlocks";

export function filterGlobalBlocksByRules(
  globalBlocks: BlockRecord,
  page: Page,
  config: ConfigCommon
): Page {
  const validGlobalBlockIds = new Set<string>();

  Object.entries(globalBlocks).forEach(([uid, globalBlock]) => {
    if (globalBlock.data.deleted) {
      return;
    }

    if (canUseCondition({ globalBlock, page, config })) {
      validGlobalBlockIds.add(uid);
    }
  });

  const filteredItems = (page.data.items ?? []).filter((item: Block) => {
    if (item.type !== ElementTypes.GlobalBlock) {
      return true;
    }

    const id = item.value?.globalBlockId || item.value?._id;
    return id && validGlobalBlockIds.has(id);
  });

  const filteredBlocks = page.blocks?.filter((block) =>
    validGlobalBlockIds.has(block.id)
  );

  const filteredDependencies = (page.dependencies ?? []).filter((uid) =>
    validGlobalBlockIds.has(uid)
  );

  return {
    ...page,
    data: {
      ...page.data,
      items: filteredItems
    },
    blocks: filteredBlocks,
    dependencies: filteredDependencies
  };
}
