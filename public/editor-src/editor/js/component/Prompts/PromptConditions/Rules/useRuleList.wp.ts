import { useEffect, useState } from "react";
import { setIn } from "timm";
import { useConfig } from "visual/providers/ConfigProvider";
import { Rule } from "visual/types/Rule";
import {
  getGroupList,
  getRulePostsGroupList,
  getTerms
} from "visual/utils/api";
import {
  CATEGORIES_GROUP_ID,
  PAGES_GROUP_ID,
  TEMPLATES_GROUP_ID
} from "visual/utils/blocks/blocksConditions";
import {
  isCollectionItemRule,
  isCollectionTypeRule
} from "visual/utils/blocks/guards";
import { RuleList } from "./types";
import {
  disableAlreadyUsedRules,
  getRulesListIndexByRule,
  getUniqRules
} from "./utils";

export default function useRuleList(
  rules: Rule[],
  type: "popup" | "block"
): [boolean, RuleList[]] {
  const [rulesList, setRulesList] = useState<RuleList[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const config = useConfig();

  useEffect(() => {
    async function fetchData(): Promise<void> {
      setListLoading(true);

      const groupList = (await getGroupList(type, config)) || [];
      // @ts-expect-error need transformer to ts getGroupList
      const rulesList = groupList.map(({ items }) => items).flat();

      setListLoading(false);
      setRulesList(rulesList);
    }

    fetchData();
  }, [type, config]);

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
            let newItems: RuleList[] = [];

            switch (group) {
              case PAGES_GROUP_ID:
              case TEMPLATES_GROUP_ID: {
                const posts = await getRulePostsGroupList(
                  rule.entityType,
                  config
                );

                newItems = posts.map(({ value, title, items }) => {
                  if (Array.isArray(items)) {
                    return {
                      title,
                      items: items.map(({ title, value, status }) => ({
                        title,
                        status,
                        value: `${value}`
                      })),
                      value: `${value}`,
                      mode: items.find(
                        (subItem) => rule.entityType === subItem.groupValue
                      )
                        ? "specific"
                        : "reference"
                    };
                  }

                  return { title, value: `${value}` };
                });
                break;
              }
              case CATEGORIES_GROUP_ID: {
                const terms = await getTerms(rule.entityType, config);
                newItems = terms.map(({ name, term_id }) => ({
                  title: name,
                  value: `${term_id}`,
                  mode: "specific"
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
  }, [rules, rulesList, config]);

  return [listLoading, rulesList];
}
