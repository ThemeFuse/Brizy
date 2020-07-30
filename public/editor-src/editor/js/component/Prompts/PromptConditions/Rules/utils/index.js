import _ from "underscore";
import { setIn } from "timm";

export const PAGES_GROUP_ID = 1;
export const CATEGORIES_GROUP_ID = 2;
export const TEMPLATES_GROUP_ID = 16;

export const PAGE_TYPE = "page";

export function getUniqRules(rules) {
  return rules.reduce((acc, item) => {
    const isDuplicate = acc.find(
      ({ appliedFor, entityType }) =>
        appliedFor === item.appliedFor && entityType === item.entityType
    );

    if (!isDuplicate) {
      acc.push(item);
    }

    return acc;
  }, []);
}

export function getRulesListIndexByRule(rulesList, { appliedFor, entityType }) {
  return rulesList.findIndex(
    ({ groupValue, value }) => groupValue === appliedFor && value === entityType
  );
}

export function disableAlreadyUsedRules(rules, rulesList) {
  if (!rulesList.length) return rulesList;

  let newRuleList = rulesList;
  rules.forEach(rule => {
    const ruleIndex = getRulesListIndexByRule(rulesList, rule);

    if (
      rule.appliedFor !== PAGES_GROUP_ID &&
      rule.appliedFor !== CATEGORIES_GROUP_ID
    ) {
      newRuleList = setIn(newRuleList, [ruleIndex, "disabled"], true);
    } else {
      const { items } = newRuleList[ruleIndex];
      if (items && rule.entityValues.length) {
        const itemIndex = items.findIndex(({ value: { _id } }) =>
          rule.entityValues.includes(_id)
        );
        if (itemIndex !== -1) {
          newRuleList = setIn(
            newRuleList,
            [ruleIndex, "items", itemIndex, "disabled"],
            true
          );
        }
      }
    }
  });

  return newRuleList;
}

export function filterRules(rules) {
  return (
    rules
      .filter(function(item, index) {
        return (
          rules.findIndex(
            ({ appliedFor, entityType, entityValues }) =>
              appliedFor === item.appliedFor &&
              entityType === item.entityType &&
              _.isEqual(entityValues, item.entityValues)
          ) >= index
        );
      })
      // eslint-disable-next-line no-unused-vars
      .map(({ id, ...rest }) => rest)
  );
}
