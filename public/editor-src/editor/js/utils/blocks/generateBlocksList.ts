import Config from "visual/global/Config";
import { ReduxState } from "visual/redux/types";
import { Block, GlobalBlockPosition } from "visual/types";
import { isGlobalBlock } from "visual/types/utils";
import { isPopup, isStory } from "visual/utils/models";
import { getAllowedGBIds } from "./getAllowedGBIds";

const generateConditionBlocks = (
  ids: string[],
  globalBlocks: ReduxState["globalBlocks"],
  type: GlobalBlockPosition["align"]
): string[] => {
  return ids
    .filter(
      (id) =>
        globalBlocks[id]?.position?.align === type &&
        globalBlocks[id].status === "publish"
    )
    .sort((id, nextId) => {
      const gBlock = globalBlocks[id]?.position?.[type] ?? 0;
      const nextGBlock = globalBlocks[nextId]?.position?.[type] ?? 0;
      return gBlock - nextGBlock;
    });
};

export const generateBlocksList = (
  pageBlocksIds: ReduxState["page"]["id"][],
  globalBlocks: ReduxState["globalBlocks"],
  page: ReduxState["page"]
): string[] => {
  const config = Config.getAll();
  if (isPopup(config) || isStory(config)) {
    return pageBlocksIds;
  }

  const withoutPopups = Object.entries(globalBlocks)
    .filter(([, block]) => {
      return isGlobalBlock(block);
    })
    .reduce((blocks, [uid, data]) => ({ ...blocks, [uid]: data }), {});
  const allowedGBIds = getAllowedGBIds(pageBlocksIds, withoutPopups, page);

  const topAlignedConditionBlocks = generateConditionBlocks(
    allowedGBIds,
    globalBlocks,
    "top"
  );
  const bottomAlignedConditionBlocks = generateConditionBlocks(
    allowedGBIds,
    globalBlocks,
    "bottom"
  );

  const blocks = [
    ...topAlignedConditionBlocks,
    ...pageBlocksIds,
    ...bottomAlignedConditionBlocks
  ];

  return blocks;
};

export function getBlocksInPage(
  page: ReduxState["page"],
  globalBlocks: ReduxState["globalBlocks"]
): Block[] {
  const items = page.data?.items || [];

  const transformedPageBlocks = items.reduce((acc, block) => {
    if (block.type !== "GlobalBlock") {
      acc[block.value._id] = { data: block };
    }

    return acc;
  }, {} as { [k: string]: { data: Block } });

  const pageBlocksIds = Object.keys(transformedPageBlocks);

  const blocksIdsInPage = generateBlocksList(pageBlocksIds, globalBlocks, page);

  const allBlocks = { ...transformedPageBlocks, ...globalBlocks };

  const blocks = blocksIdsInPage.map((id) => allBlocks[id].data);

  return blocks;
}
