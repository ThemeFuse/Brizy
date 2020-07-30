import { getAllowedGBIds } from "./getAllowedGBIds";
import { ReduxState } from "visual/redux/types";
import { Block, GlobalBlockPosition } from "visual/types";

import { IS_GLOBAL_POPUP } from "visual/utils/models";

const generateConditionBlocks = (
  ids: string[],
  globalBlocks: ReduxState["globalBlocks"],
  type: GlobalBlockPosition["align"]
): string[] => {
  return ids
    .filter(
      id =>
        globalBlocks[id]?.position?.align === type &&
        globalBlocks[id].status === "publish"
    )
    .sort(
      (id, nextId) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        globalBlocks[id].position[type] - globalBlocks[nextId].position[type]
    );
};

export const generateBlocksList = (
  pageBlocksIds: string[],
  globalBlocks: ReduxState["globalBlocks"],
  pageId: number
): string[] => {
  if (IS_GLOBAL_POPUP) {
    return pageBlocksIds;
  }

  const allowedGBIds = getAllowedGBIds(pageBlocksIds, globalBlocks, pageId);

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
  const pageId = Number(page.id);
  const items = page.data?.items || [];

  const transformedPageBlocks = items.reduce((acc, block) => {
    if (block.type !== "GlobalBlock") {
      acc[block.value._id] = { data: block };
    }

    return acc;
  }, {} as { [k: string]: { data: Block } });

  const pageBlocksIds = Object.keys(transformedPageBlocks);

  const blocksIdsInPage = generateBlocksList(
    pageBlocksIds,
    globalBlocks,
    pageId
  );

  const allBlocks = { ...transformedPageBlocks, ...globalBlocks };

  const blocks = blocksIdsInPage.map(id => allBlocks[id].data);

  return blocks;
}
