import { produce } from "immer";
import Config from "visual/global/Config";
import { isCustomerPage } from "visual/global/Config/types/configs/Base";
import {
  isCloud,
  isCollectionPage,
  isEcwidCategoryPage,
  isEcwidProductPage
} from "visual/global/Config/types/configs/Cloud";
import { isWp } from "visual/global/Config/types/configs/WP";
import { EcwidCategoryId, EcwidProductId } from "visual/global/Ecwid";
import { pageSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import {
  BlockTypeRule,
  CloudReferenceAllEntity,
  CloudReferenceEntity,
  CollectionTypeRule,
  GlobalBlock,
  GlobalBlockPosition,
  Page
} from "visual/types";
import {
  ECWID_PRODUCT_CATEGORY_TYPE,
  ECWID_PRODUCT_TYPE
} from "visual/utils/ecwid";
import { isGlobalPopup } from "visual/types/utils";
import { isTemplate } from "visual/utils/models";
import * as NoEmptyString from "visual/utils/string/NoEmptyString";
import { canUseCondition } from "../getAllowedGBIds";
import { isCollectionItemRule } from "../guards";
import {
  AlignsList,
  GB,
  GBIds,
  GBP,
  GBPWithoutNull,
  InsertScheme,
  PB,
  PositionAlign,
  SortedGBPositions,
  SurroundedConditionsIds
} from "./types";

export const PAGES_GROUP_ID = 1;
export const CATEGORIES_GROUP_ID = 2;
export const TEMPLATES_GROUP_ID = 16;
export const TEMPLATE_TYPE = "editor-template";
export const CUSTOMER_TYPE = "customer";

function getGBIdsInPage(blocksOrder: PB, globalBlocks: GB): PB {
  return blocksOrder.filter((id) => globalBlocks[id]);
}

function getGBChunks(
  GBIdsInPage: PB,
  sourceGBIds: PB,
  GBTopIds: PB
): InsertScheme {
  const insertScheme: InsertScheme = {};
  let queue: SortedGBPositions = [];
  let lastSourceId = "";

  GBIdsInPage.forEach((id, index, arr) => {
    const isSourceGBId = sourceGBIds.includes(id);

    if (isSourceGBId) {
      insertScheme[id] = { ...insertScheme[id], before: queue };
      lastSourceId = id;
      queue = [];
    }

    if (!isSourceGBId) {
      queue.push({
        globalBlockId: id,
        // write a function which will return top | bottom by id
        align: GBTopIds.includes(id) ? "top" : "bottom"
      });
    }

    if (index === arr.length - 1 && queue.length) {
      insertScheme[lastSourceId] = {
        ...insertScheme[lastSourceId],
        after: queue
      };
    }
  });

  return insertScheme;
}

function applyScheme(
  sourcePositionsArr: SortedGBPositions,
  insertScheme: InsertScheme
): SortedGBPositions {
  // ! an ugly-ugly temp hack. happens only when there isn't any another global blocks
  if (!sourcePositionsArr.length && insertScheme[""]?.after) {
    return insertScheme[""].after;
  } else if (sourcePositionsArr.length && insertScheme[""]) {
    insertScheme[sourcePositionsArr[0].globalBlockId] = insertScheme[""];
    delete insertScheme[""];
  }

  const newPositionArr = sourcePositionsArr.reduce((acc, position) => {
    const id = position.globalBlockId;

    if (insertScheme[id]?.before) {
      acc.push(...insertScheme[id].before);
    }

    acc.push(position);

    if (insertScheme[id]?.after) {
      acc.push(...insertScheme[id].after);
    }

    return acc;
  }, [] as SortedGBPositions);

  return newPositionArr;
}

function replaceSourcePositions(
  sourcePositionsArr: SortedGBPositions,
  sourceGBIds: PB,
  GBTopIds: PB
): SortedGBPositions {
  // ! find a better way to implement this
  const newSourceGBIds = [...sourceGBIds];
  return sourcePositionsArr.reduce((acc, item) => {
    if (sourceGBIds.includes(item.globalBlockId)) {
      const currentId = newSourceGBIds.shift();

      // this conditions is needed only for typescript
      if (currentId) {
        acc.push({
          globalBlockId: currentId,
          align: GBTopIds.includes(currentId) ? "top" : "bottom"
        });
      }
    } else {
      acc.push(item);
    }

    return acc;
  }, [] as SortedGBPositions);
}

export function getPositions(blocksOrder: PB, globalBlocks: GB): GBP {
  const sourcePositionObj = Object.entries(globalBlocks).reduce(
    (acc, [id, block]) => {
      if (block.position) {
        acc[id] = block.position;
      }

      return acc;
    },
    {} as GBPWithoutNull
  );

  const sourcePositionsArr = turnPositionsIntoSortedArray(sourcePositionObj);

  const { top: GBTopIds } = getSurroundedGBIds(blocksOrder, globalBlocks);

  const GBIdsInPage = getGBIdsInPage(blocksOrder, globalBlocks);
  const sourceGBIds = GBIdsInPage.filter((id) => sourcePositionObj[id]);

  const insertScheme = getGBChunks(GBIdsInPage, sourceGBIds, GBTopIds);

  const sourceTop = replaceSourcePositions(
    sourcePositionsArr.top,
    sourceGBIds,
    GBTopIds
  );
  const newTop = applyScheme(sourceTop, insertScheme);

  const sourceBottom = replaceSourcePositions(
    sourcePositionsArr.bottom,
    sourceGBIds,
    GBTopIds
  );
  const newBottom = applyScheme(sourceBottom, insertScheme);

  return turnPositionsIntoObject(newTop, newBottom);
}

export const getSurroundedGBIds = (
  pageBlocksIds: PB,
  globalBlocks: GB
): SurroundedConditionsIds => {
  const globalBlocksIds = Object.keys(globalBlocks);
  const surroundedConditionsIds: SurroundedConditionsIds = {
    top: [],
    bottom: []
  };

  if (pageBlocksIds.length > 0) {
    const pageBlocksIsAllGlobalBlocks = pageBlocksIds.every((pageBlockId) =>
      globalBlocksIds.includes(pageBlockId)
    );

    if (pageBlocksIsAllGlobalBlocks) {
      pageBlocksIds.forEach((pageBlockId) => {
        const globalBlock = globalBlocks[pageBlockId];

        // Case for internals/externals popup
        // The popup don't have any position it's only one on the page
        if (isGlobalPopup(globalBlock)) {
          return;
        }

        if (globalBlock?.position && globalBlock.position.align) {
          const { position } = globalBlock;
          surroundedConditionsIds[position.align].push(pageBlockId);
        }
      });
    } else {
      let i = 0;
      while (i <= pageBlocksIds.length - 1) {
        const currentBlockId = pageBlocksIds[i];
        if (globalBlocksIds.includes(currentBlockId)) {
          surroundedConditionsIds.top.push(currentBlockId);
        } else {
          break;
        }
        i++;
      }

      i = 0;
      while (i <= pageBlocksIds.length - 1) {
        const currentBlockId = pageBlocksIds[pageBlocksIds.length - 1 - i];
        if (globalBlocksIds.includes(currentBlockId)) {
          surroundedConditionsIds.bottom.push(currentBlockId);
        } else {
          break;
        }
        i++;
      }
    }
  }

  return surroundedConditionsIds;
};

function turnPositionsIntoSortedArray(positions: GBPWithoutNull): {
  top: SortedGBPositions;
  bottom: SortedGBPositions;
} {
  type PositionsAsArray = {
    top: (GlobalBlockPosition & { globalBlockId: string })[];
    bottom: (GlobalBlockPosition & { globalBlockId: string })[];
  };

  const { top, bottom } = Object.entries(positions).reduce(
    (acc, [globalBlockId, value]): PositionsAsArray => {
      acc.top.push({
        ...value,
        globalBlockId,
        // normally align should always exist.It's needed only
        // for old global blocks
        align: value.align || "top"
      });
      acc.bottom.push({
        ...value,
        globalBlockId,
        align: value.align || "top"
      });

      return acc;
    },
    {
      top: [],
      bottom: []
    } as PositionsAsArray
  );

  return {
    top: sortedGlobalBlockIds(top, "top"),
    bottom: sortedGlobalBlockIds(bottom, "bottom")
  };

  function sortedGlobalBlockIds(
    positions: PositionsAsArray["top"] | PositionsAsArray["bottom"],
    type: "top" | "bottom"
  ): SortedGBPositions {
    return positions
      .sort((a, b) => a[type] - b[type])
      .map(({ globalBlockId, align }) => ({
        globalBlockId,
        align
      }));
  }
}

function turnPositionsIntoObject(
  top: SortedGBPositions,
  bottom: SortedGBPositions
): GBPWithoutNull {
  const acc: GBPWithoutNull = {};

  transformPosition(top, "top", acc);
  transformPosition(bottom, "bottom", acc);

  return acc;

  function transformPosition(
    positions: SortedGBPositions,
    type: PositionAlign,
    accumulator: GBPWithoutNull
  ): GBPWithoutNull {
    return positions.reduce((acc, { globalBlockId, align }, index) => {
      acc[globalBlockId] = {
        ...acc[globalBlockId],
        align,
        [type]: index
      };

      return acc;
    }, accumulator);
  }
}

// this method is calling from redux/globalBlocks
// we can't get pageId from config because -
// if there is are not pages we create one on client side.
export function getCurrentRule(page = pageSelector(getStore().getState())): {
  group: CollectionTypeRule["appliedFor"];
  type: CollectionTypeRule["entityType"];
  id: Page["id"] | EcwidCategoryId | EcwidProductId;
} {
  const config = Config.getAll();
  let group = PAGES_GROUP_ID;
  let type = "page";
  let id: string | EcwidProductId | EcwidCategoryId = page.id;

  if (isCollectionPage(page)) {
    type = page.collectionType.id;
  }

  if (isCloud(config) && isCustomerPage(config.page)) {
    type = CUSTOMER_TYPE;
  }

  if (isEcwidProductPage(page)) {
    type = ECWID_PRODUCT_TYPE;
    id = page.productId;
  }

  if (isEcwidCategoryPage(page)) {
    type = ECWID_PRODUCT_CATEGORY_TYPE;
    id = page.categoryId;
  }

  if (isWp(config)) {
    if (isTemplate(config)) {
      group = TEMPLATES_GROUP_ID;
      type = TEMPLATE_TYPE;
    } else {
      const { ruleMatches } = config.wp;
      const rule = ruleMatches[0] ?? {
        group: PAGES_GROUP_ID,
        entityType: "page"
      };
      group = rule.group;
      type = rule.entityType;
    }
  }

  return {
    group,
    type: NoEmptyString.is(type)
      ? type
      : ("page" as NoEmptyString.NoEmptyString),
    id
  };
}

export function getSurroundedConditions(
  pageBlocksIds: PB,
  globalBlocksIds: GBIds
): SurroundedConditionsIds {
  const surroundedConditionsIds: SurroundedConditionsIds = {
    top: [],
    bottom: []
  };

  if (pageBlocksIds.length > 0) {
    let i = 0;
    while (i <= pageBlocksIds.length - 1) {
      const currentBlockId = pageBlocksIds[i];
      if (globalBlocksIds.includes(currentBlockId)) {
        surroundedConditionsIds.top.push(currentBlockId);
      } else {
        break;
      }
      i++;
    }

    i = 0;
    while (i <= pageBlocksIds.length - 1) {
      const currentBlockId = pageBlocksIds[pageBlocksIds.length - 1 - i];
      if (globalBlocksIds.includes(currentBlockId)) {
        surroundedConditionsIds.bottom.push(currentBlockId);
      } else {
        break;
      }
      i++;
    }
  }

  return surroundedConditionsIds;
}

export function getBlockAlignment(
  pageBlocksIds: PB,
  index: number,
  globalBlockIds: GBIds
): AlignsList {
  const prevBlockId = pageBlocksIds[index - 1];
  const nextBlockId = pageBlocksIds[index + 1];

  const { top, bottom } = getSurroundedConditions(
    pageBlocksIds,
    globalBlockIds
  );

  let align: AlignsList = "center";
  if (
    !prevBlockId ||
    (globalBlockIds.includes(prevBlockId) && top.includes(prevBlockId))
  ) {
    align = "top";
  } else if (
    !nextBlockId ||
    (globalBlockIds.includes(nextBlockId) && bottom.includes(nextBlockId))
  ) {
    align = "bottom";
  }

  return align;
}

export function changeRule(
  globalBlock: GlobalBlock,
  shouldAddIncludeCondition: boolean,
  page: Page
): GlobalBlock {
  const currentRule = getCurrentRule(page);

  const newGlobalBlock = {
    ...globalBlock,
    rules: globalBlock.rules.filter(
      (rule) =>
        !isCollectionItemRule(rule) ||
        !rule.entityValues.some((v) => String(v) === String(currentRule.id))
    )
  };

  const blockIsVisible = canUseCondition(newGlobalBlock, page);
  if (
    (!shouldAddIncludeCondition && blockIsVisible) ||
    (shouldAddIncludeCondition && !blockIsVisible)
  ) {
    return produce(newGlobalBlock, (draft) => {
      draft.rules.push({
        type: shouldAddIncludeCondition
          ? BlockTypeRule.include
          : BlockTypeRule.exclude,
        mode: "specific",
        appliedFor: currentRule.group,
        entityType: currentRule.type,
        entityValues: [currentRule.id]
      });
    });
  }

  return newGlobalBlock;
}

export function createEntityValueAll(c: {
  fieldId: string;
}): CloudReferenceAllEntity {
  return c.fieldId as CloudReferenceAllEntity;
}

export function createEntityValue(c: {
  fieldId: string;
  collectionId: string;
}): CloudReferenceEntity {
  return `${c.fieldId}:${c.collectionId}` as CloudReferenceEntity;
}

export function getEntityValue(
  s: string
): { fieldId: string; collectionId?: string } | undefined {
  const [fieldId, collectionId] = s.split(":");

  if (fieldId) {
    return collectionId ? { fieldId, collectionId } : { fieldId };
  }

  return undefined;
}
