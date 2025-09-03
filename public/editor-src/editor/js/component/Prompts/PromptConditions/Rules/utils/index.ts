import { Str } from "@brizy/readers";
import classNames from "classnames";
import { setIn } from "timm";
import { Refs } from "visual/component/Prompts/PromptConditions/Rules/utils/api";
import {
  ConditionCollectionType,
  Customer,
  CustomerGroup
} from "visual/global/Config/types/configs/ConfigCommon";
import {
  CollectionItemRule,
  CollectionTypeRule,
  Rule
} from "visual/types/Rule";
import {
  CATEGORIES_GROUP_ID,
  PAGES_GROUP_ID
} from "visual/utils/blocks/blocksConditions";
import {
  isAllRule,
  isCollectionItemRule,
  isCollectionTypeRule
} from "visual/utils/blocks/guards";
import { MValue, isT } from "visual/utils/value";
import { CmsListItem, RuleList, RuleListItem, ValueItems } from "../types";

export function getRulesListIndexByRule(
  rulesList: RuleList[],
  { appliedFor, entityType }: CollectionTypeRule | CollectionItemRule
): number {
  return rulesList.findIndex(
    ({ groupValue, value }) => groupValue === appliedFor && value === entityType
  );
}

export function getItemsIndex(
  items: RuleListItem[],
  id: string | number
): number {
  return items.findIndex((item) => {
    return item.value === id;
  });
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

  const foundItemSubitems = items.find((item) =>
    item.items?.some((nestedItem) => Str.read(nestedItem.value) === ruleValue)
  );

  const foundItem = items.find((item) => item.value === ruleValue);

  if (!foundItem && !foundItemSubitems) {
    return undefined;
  }

  if (foundItemSubitems?.items) {
    return foundItemSubitems.items.find(
      (nestedItem) => Str.read(nestedItem.value) === ruleValue
    );
  }

  // Category collection has no items
  return foundItem as ValueItems;
};

export const getOptionItemClassNames = (active: boolean): string =>
  classNames(
    "brz-d-xs-flex brz-align-items-xs-center brz-ed-controls-type-option-item",
    {
      "brz-ed-controls-item-active": active
    }
  );

type WithoutId<T> = (Omit<T, "id"> & { value: string })[];

export const convertIdToValue = <T extends { id: string }>(
  items: T[]
): WithoutId<T> =>
  items.map(({ id, ...rest }) => ({
    value: id,
    ...rest
  })) as WithoutId<T>;

export const convertCustomerIdToValue = <T extends Customer>(
  items: T[]
): WithoutId<{ id: string; title: string }> =>
  items.map(({ id, firstName, lastName, ...rest }) => ({
    value: id,
    title: `${firstName} ${lastName}`,
    ...rest
  })) as WithoutId<{ id: string; title: string }>;

export const convertCustomerGroupIdToValue = (
  items: CustomerGroup[]
): WithoutId<{ id: string; title: string }> =>
  items.map(({ id, name, ...rest }) => ({
    value: id,
    title: name,
    ...rest
  })) as WithoutId<{ id: string; title: string }>;

export const getRefsById = (collectionType: ConditionCollectionType[]) =>
  collectionType.reduce((acc, { id, fields }) => {
    if (fields) {
      const refs = fields
        .map((field) => {
          if (field.__typename === "CollectionTypeFieldReference") {
            return {
              type: "single" as const,
              value: field.settings.collectionType.id,
              title: field.label,
              fieldId: field.id
            };
          } else if (field.__typename === "CollectionTypeFieldMultiReference") {
            return {
              type: "multi" as const,
              value: field.settings.collectionType.id,
              title: field.label,
              fieldId: field.id
            };
          } else {
            return undefined;
          }
        })
        .filter(isT);

      if (refs.length > 0) {
        acc[id] = refs;
      }
    }

    return acc;
  }, {} as Refs);

export const hasEntityValues = (
  collections: RuleListItem[],
  entityRule: CollectionItemRule
): boolean => {
  if (!entityRule.entityValues?.length) {
    return false;
  }

  const allValues = collections.flatMap(
    (group) => group.items?.map((item) => item.value) ?? []
  );

  return entityRule.entityValues.some((entityValue) =>
    allValues.includes(entityValue)
  );
};

export const mergeCollectionGroups = (
  collection1: CmsListItem,
  collection2: CmsListItem
): CmsListItem => {
  if (
    collection1.title !== collection2.title ||
    collection1.value !== collection2.value
  ) {
    throw new Error(
      "Collections must have the same title, value, and mode to be merged"
    );
  }
  const mergedItems = [...collection1.items, ...collection2.items].reduce<
    Map<string | number, ValueItems>
  >((map, item) => {
    if (!map.has(item.value)) {
      map.set(item.value, item);
    }
    return map;
  }, new Map());

  const sortedItems = Array.from(mergedItems.values()).sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  return {
    ...collection1,
    items: sortedItems
  };
};
