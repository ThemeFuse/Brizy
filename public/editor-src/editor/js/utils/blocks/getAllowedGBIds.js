import _ from "underscore";
import Config from "visual/global/Config";
import {
  getCurrentRule,
  TEMPLATES_GROUP_ID,
  TEMPLATE_TYPE
} from "./blocksConditions";
import { isPopup } from "./isPopup";
import { IS_TEMPLATE } from "visual/utils/models";

export const getAllowedGBIds = (pageBlocksIds, globalBlocks, pageId) => {
  return Object.entries(globalBlocks).reduce(
    (acc, [currentGlobalBlockId, globalBlock]) => {
      const isInPage = pageBlocksIds.includes(currentGlobalBlockId);

      if (!isInPage && canUseCondition(globalBlock, pageId)) {
        acc.push(currentGlobalBlockId);
      }

      return acc;
    },
    []
  );
};

export function canUseCondition(globalBlock, pageId) {
  return IS_TEMPLATE
    ? canUseConditionInTemplates(globalBlock)
    : canUseConditionInPage(globalBlock, pageId);
}

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

export function pageSplitRules(rules = [], pageId) {
  const currentRule = getCurrentRule(pageId);

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

export function canUseConditionInPage(globalBlock, pageId) {
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

  const { level1, level2, level3 } = pageSplitRules(rules, pageId);

  if (level1) {
    return isIncludeCondition(level1);
  }

  if (level2) {
    return isIncludeCondition(level2);
  }

  if (level3) {
    return isIncludeCondition(level3);
  }

  return false;
}

export function isIncludeCondition(condition) {
  return condition.type === 1;
}
