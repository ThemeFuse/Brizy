import _ from "underscore";
import Config from "visual/global/Config";
import { IS_CMS } from "visual/utils/env";
import {
  getCurrentRule,
  TEMPLATES_GROUP_ID,
  TEMPLATE_TYPE
} from "./blocksConditions";
import { isPopup } from "./isPopup";
import { IS_TEMPLATE } from "visual/utils/models";

export const getAllowedGBIds = (pageBlocksIds, globalBlocks, page) => {
  return Object.entries(globalBlocks).reduce(
    (acc, [currentGlobalBlockId, globalBlock]) => {
      const isInPage = pageBlocksIds.includes(currentGlobalBlockId);
      const canUseCondition = IS_TEMPLATE
        ? canUseConditionInTemplates(globalBlock)
        : canUseConditionInPage(globalBlock, page);

      if (!isInPage && canUseCondition) {
        acc.push(currentGlobalBlockId);
      }

      return acc;
    },
    []
  );
};

export function canUseConditionInTemplates({ rules }) {
  const { ruleMatches, page } = Config.get("wp");

  const templateCondition = rules.find(
    ({ entityType, appliedFor, entityValues }) =>
      appliedFor === TEMPLATES_GROUP_ID &&
      entityType === TEMPLATE_TYPE &&
      entityValues.includes(page)
  );

  if (templateCondition) {
    return isIncludeCondition(templateCondition);
  }

  const templateRules = ruleMatches.map(
    ({ type, group, entityType, values }) => ({
      type,
      entityType,
      appliedFor: group,
      entityValues: values
    })
  );

  const blockGroupedRules = templateSplitRules(rules);
  const templateGroupedRules = templateSplitRules(templateRules);

  let condition = blockGroupedRules.level1.find(rule =>
    templateGroupedRules.level1.find(
      ({ entityType, appliedFor, entityValues }) =>
        appliedFor === rule.appliedFor &&
        entityType === rule.entityType &&
        _.intersection(entityValues, rule.entityValues).length
    )
  );

  if (condition) {
    return isIncludeCondition(condition);
  }

  condition = blockGroupedRules.level2.find(rule =>
    templateGroupedRules.level2.find(
      ({ entityType, appliedFor }) =>
        appliedFor === rule.appliedFor && entityType === rule.entityType
    )
  );

  if (condition) {
    return isIncludeCondition(condition);
  }

  // condition = blockGroupedRules.level3.find(rule =>
  //   templateGroupedRules.level3.find(
  //     ({ appliedFor }) => appliedFor === rule.appliedFor
  //   )
  // );

  if (blockGroupedRules.level3.length) {
    return isIncludeCondition(blockGroupedRules.level3[0]);
  }

  return false;
}

export function templateSplitRules(rules) {
  return rules.reduce(
    (acc, item) => {
      const { appliedFor, entityType, entityValues } = item;
      if (entityType === TEMPLATE_TYPE) return acc;

      if (appliedFor === "" || appliedFor === null) {
        acc.level3.push(item);
      } else if (entityValues.length) {
        acc.level1.push(item);
      } else {
        acc.level2.push(item);
      }

      return acc;
    },
    {
      level1: [],
      level2: [],
      level3: []
    }
  );
}

export function pageSplitRules(rules = [], page) {
  const currentRule = getCurrentRule(page);

  const level1 = rules.find(
    ({ appliedFor, entityType, entityValues }) =>
      appliedFor === currentRule.group &&
      entityType === currentRule.type &&
      entityValues.includes(currentRule.id)
  );

  const level2 = rules.find(
    ({ appliedFor, entityType, entityValues }) =>
      appliedFor === currentRule.group &&
      entityType === currentRule.type &&
      !entityValues.length
  );

  const level3 = rules.find(
    ({ appliedFor, entityType }) =>
      (appliedFor === "" || appliedFor === null) && entityType === ""
  );

  return {
    level1,
    level2,
    level3
  };
}

function pageCMSSplitRules(rules = [], refs = []) {
  return rules.find(({ entityType, entityValues }) => {
    let equalRules = false;
    refs.forEach(ref => {
      if (ref.entityType === entityType) {
        equalRules = _.intersection(ref.entityValues, entityValues);
      }
    });

    return equalRules.length;
  });
}

export function canUseConditionInPage(globalBlock, page) {
  if (!globalBlock) {
    // Normally it should never happen.
    // Some projects has globalBlock into pageJson and doesn't have it into globalBlocks
    // and preview corrupts
    if (IS_EDITOR) {
      throw Error("GlobalBlock should exist");
    } else {
      // block will be ignored by compiler
      return false;
    }
  }

  const { rules, data } = globalBlock;

  if (isPopup(data)) {
    return true;
  }

  const {
    level1: level1Rule,
    level2: level2Rule,
    level3: level3Rule
  } = pageSplitRules(rules, page);

  let cmsRule = false;
  if (IS_CMS) {
    const { fields } = page;

    const refs = getFieldsReferences(fields);
    cmsRule = pageCMSSplitRules(rules, refs);
  }

  if (level1Rule) {
    return isIncludeCondition(level1Rule);
  }

  if (cmsRule) {
    return isIncludeCondition(cmsRule);
  }

  if (level2Rule) {
    return isIncludeCondition(level2Rule);
  }

  if (level3Rule) {
    return isIncludeCondition(level3Rule);
  }

  return false;
}

export function isIncludeCondition(condition) {
  return condition.type === 1;
}

function getFieldsReferences(fields) {
  return fields
    .filter(
      ({ __typename }) =>
        __typename === "CollectionItemFieldReference" ||
        __typename === "CollectionItemFieldMultiReference"
    )
    .map(field => {
      if (field.__typename === "CollectionItemFieldReference") {
        const entityType = field.type.collectionType.id;
        const entityValues = field.values.collectionItem.id;

        return {
          appliedFor: 1,
          entityType,
          entityValues
        };
      } else if (field.__typename === "CollectionItemFieldMultiReference") {
        const entityType = field.type.collectionType.id;
        const entityValues = field.values.collectionItems.map(({ id }) => id);

        return {
          appliedFor: 1,
          entityType,
          entityValues
        };
      } else {
        return undefined;
      }
    });
}
