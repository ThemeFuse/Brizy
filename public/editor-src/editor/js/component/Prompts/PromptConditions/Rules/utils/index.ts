import { setIn } from "timm";
import { CollectionItemRule, CollectionTypeRule, Rule } from "visual/types";
import {
  CATEGORIES_GROUP_ID,
  PAGES_GROUP_ID
} from "visual/utils/blocks/blocksConditions";
import {
  isAllRule,
  isCollectionItemRule,
  isCollectionTypeRule
} from "visual/utils/blocks/guards";
import { RuleList, RuleListItem, ValueItems } from "../types";
import { Str } from "@brizy/readers";
import { MValue } from "visual/utils/value";
import classNames from "classnames";

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
  rules.forEach((rule) => {
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
  rules.forEach((rule) => {
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

export const getValue = (
  items: RuleListItem[],
  rule: CollectionItemRule
): MValue<ValueItems> => {
  const ruleValue = Str.read(rule.entityValues?.[0]);
  if (!ruleValue) {
    return undefined;
  }

  const foundItem = items.find((item) =>
    item.items?.some((nestedItem) => Str.read(nestedItem.value) === ruleValue)
  );

  if (!foundItem || !foundItem.items) {
    return undefined;
  }

  return foundItem.items.find(
    (nestedItem) => Str.read(nestedItem.value) === ruleValue
  );
};

export const getOptionItemClassNames = (active: boolean): string =>
  classNames(
    "brz-d-xs-flex brz-align-items-xs-center brz-ed-controls-type-option-item",
    {
      "brz-ed-controls-item-active": active
    }
  );
