import { useState, useEffect } from "react";
import { setIn } from "timm";

import {
  PAGES_GROUP_ID,
  CATEGORIES_GROUP_ID,
  TEMPLATES_GROUP_ID
} from "visual/utils/blocks/blocksConditions";

import {
  getUniqRules,
  getRulesListIndexByRule,
  disableAlreadyUsedRules
} from "./utils";

import { getGroupList, getPostObjects } from "visual/utils/api/index-legacy.wp";
import { getTerms } from "visual/utils/api/index.wp";
import { Rule } from "visual/types";
import { RuleList } from "./types";
import {
  isCollectionItemRule,
  isCollectionTypeRule
} from "visual/utils/blocks";

export default function useRuleList(rules: Rule[]): [boolean, RuleList[]] {
  const [rulesList, setRulesList] = useState<RuleList[]>([]);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      setListLoading(true);

      const groupList = (await getGroupList()) || [];
      // @ts-expect-error need transformer to ts getGroupList
      const rulesList = groupList.map(({ items }) => items).flat();

      setListLoading(false);
      setRulesList(rulesList);
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function updateRuleList(): Promise<void> {
      const uniqRules = getUniqRules(rules);

      let newRulesList = rulesList;

      for (const rule of uniqRules) {
        if (isCollectionItemRule(rule) || isCollectionTypeRule(rule)) {
          const ruleIndex = getRulesListIndexByRule(rulesList, rule);

          const group = rule.appliedFor;
          const hasItems = rulesList[ruleIndex]?.items;

          if (
            !hasItems &&
            group !== null &&
            [PAGES_GROUP_ID, CATEGORIES_GROUP_ID, TEMPLATES_GROUP_ID].includes(
              group
            )
          ) {
            let newItems = [];

            switch (group) {
              case PAGES_GROUP_ID:
              case TEMPLATES_GROUP_ID: {
                // @ts-expect-error need transformer to ts getPostObjects
                const { posts } = await getPostObjects(rule.entityType);
                // @ts-expect-error need transformer to ts getPostObjects
                newItems = posts.map(({ ID, title, post_status }) => ({
                  title: title,
                  value: ID,
                  status: post_status
                }));
                break;
              }
              case CATEGORIES_GROUP_ID: {
                const terms = await getTerms(rule.entityType);
                // @ts-expect-error need transformer to ts getPostObjects
                newItems = terms.map(({ name, term_id }) => ({
                  title: name,
                  value: term_id
                }));
                break;
              }
            }

            newRulesList = setIn(
              newRulesList,
              [ruleIndex, "items"],
              newItems
            ) as RuleList[];
            setRulesList(disableAlreadyUsedRules(rules, newRulesList));
          }
        }
      }
    }

    if (rules === null) {
      // rules from server weren't got yet
      return;
    }

    rulesList.length && updateRuleList();
  }, [rules, rulesList]);

  return [listLoading, rulesList];
}
