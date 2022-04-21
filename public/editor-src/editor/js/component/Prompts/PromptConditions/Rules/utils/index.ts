import { setIn } from "timm";

import {
  PAGES_GROUP_ID,
  CATEGORIES_GROUP_ID
} from "visual/utils/blocks/blocksConditions";
import { CollectionItemRule, CollectionTypeRule, Rule } from "visual/types";
import { RuleList } from "../types";
import {
  isAllRule,
  isCollectionItemRule,
  isCollectionTypeRule
} from "visual/utils/blocks";

export function getRulesListIndexByRule(
  rulesList: RuleList[],
  { appliedFor, entityType }: CollectionTypeRule | CollectionItemRule
): number {
  return rulesList.findIndex(
    ({ groupValue, value }) => groupValue === appliedFor && value === entityType
  );
}

export function disableAlreadyUsedRules(
  rules: Rule[],
  rulesList: RuleList[]
): RuleList[] {
  if (rulesList.length === 0) return rulesList;

  let newRuleList = rulesList;
  rules.forEach(rule => {
    if (!isCollectionItemRule(rule)) {
      return;
    }

    const ruleIndex = getRulesListIndexByRule(rulesList, rule);

    if (ruleIndex === -1) return;

    // is 1 level deep
    if (
      rule.appliedFor !== PAGES_GROUP_ID &&
      rule.appliedFor !== CATEGORIES_GROUP_ID
    ) {
      newRuleList = setIn(
        newRuleList,
        [ruleIndex, "disabled"],
        true
      ) as RuleList[];
    } else {
      const { items } = newRuleList[ruleIndex];
      if (items && rule.entityValues.length) {
        const itemIndex = items.findIndex(({ value }) =>
          rule.entityValues.includes(value)
        );
        if (itemIndex !== -1) {
          newRuleList = setIn(
            newRuleList,
            [ruleIndex, "items", itemIndex, "disabled"],
            true
          ) as RuleList[];
        }
      }
    }
  });

  return newRuleList;
}

export function getUniqRules(rules: Rule[]): Rule[] {
  // we remove here non uniq rules
  // for example if "page all" rule was added twice

  const rulesAsObject = new Map<string, Rule>();
  rules.forEach(rule => {
    let ruleKey: string | null = null;
    if (isAllRule(rule)) {
      ruleKey = `type|${rule.type}`;
    }

    if (isCollectionTypeRule(rule)) {
      ruleKey = `type|${rule.type};appliedFor|${rule.appliedFor};entityType|${rule.entityType}`;
    }

    if (isCollectionItemRule(rule)) {
      ruleKey = `type|${rule.type};appliedFor|${rule.appliedFor};entityType|${
        rule.entityType
      };entityValues|${rule.entityValues.join(",")}`;
    }

    if (ruleKey === null) {
      throw new Error(
        "Smth. went wrong. Rule can be one of type or all|collectionType|collectionItem"
      );
    } else {
      rulesAsObject.set(ruleKey, rule);
    }
  });

  return [...rulesAsObject.values()];
}
