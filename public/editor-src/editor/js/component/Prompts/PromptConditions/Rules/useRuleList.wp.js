import { useState, useEffect } from "react";
import { setIn } from "timm";

import {
  PAGES_GROUP_ID,
  CATEGORIES_GROUP_ID,
  TEMPLATES_GROUP_ID,
  getUniqRules,
  getRulesListIndexByRule,
  disableAlreadyUsedRules
} from "./utils";

import {
  getConditions,
  getTerms,
  getPostObjects
} from "visual/utils/api/editor";

export default function useRuleList(rules) {
  const [rulesList, setRulesList] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setListLoading(true);

      const conditions = (await getConditions()) || [];

      const rulesList = conditions.map(({ items }) => items).flat();

      setListLoading(false);
      setRulesList(rulesList);
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function updateRuleList() {
      const uniqRules = getUniqRules(rules);

      let newRulesList = rulesList;

      uniqRules.forEach(async rule => {
        const ruleIndex = getRulesListIndexByRule(rulesList, rule);

        const group = rule.appliedFor;
        const hasItems = rulesList[ruleIndex] && rulesList[ruleIndex].items;

        if (
          [PAGES_GROUP_ID, CATEGORIES_GROUP_ID, TEMPLATES_GROUP_ID].includes(
            group
          ) &&
          !hasItems
        ) {
          let newItems = [];
          switch (group) {
            case PAGES_GROUP_ID:
            case TEMPLATES_GROUP_ID: {
              const { posts } = await getPostObjects(rule.entityType);
              newItems = posts.map(({ ID, title }) => ({
                title: title,
                value: ID
              }));
              break;
            }
            case CATEGORIES_GROUP_ID: {
              const terms = await getTerms(rule.entityType);
              newItems = terms.map(({ name, term_id }) => ({
                title: name,
                value: term_id
              }));
              break;
            }
          }

          newRulesList = setIn(newRulesList, [ruleIndex, "items"], newItems);
          setRulesList(newRulesList);
        }
      });
    }

    // ! is it a good solution?
    rulesList.length && updateRuleList();
  }, [rules, rulesList]);

  return [listLoading, disableAlreadyUsedRules(rules, rulesList)];
}
