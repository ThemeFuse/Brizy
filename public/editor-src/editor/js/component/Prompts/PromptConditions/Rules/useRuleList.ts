/* eslint-disable @typescript-eslint/no-use-before-define */
import { useState, useEffect } from "react";
import { setIn } from "timm";
import { t } from "visual/utils/i18n";
import {
  disableAlreadyUsedRules,
  getUniqRules,
  getRulesListIndexByRule
} from "./utils";
import { getCustomerAndCollectionTypes, Refs as RefsById } from "./utils/api";
import { getCollectionItems } from "visual/utils/api/cms";
import { CUSTOMER_TYPE } from "visual/utils/blocks/blocksConditions";
import { CollectionItemRule, CollectionTypeRule, Rule } from "visual/types";
import { RuleList, RuleListItem } from "./types";
import {
  isCollectionItemRule,
  isCollectionTypeRule
} from "visual/utils/blocks";

export default function useRuleList(rules: Rule[]): [boolean, RuleList[]] {
  const [collectionRuleList, setCollectionRuleList] = useState<RuleList[]>([]);
  const [customerRuleList, setCustomerRuleList] = useState<RuleList[]>([]);
  const [listLoading, setListLoading] = useState(true);

  // it's needed only for cms!
  const [refsById, setRefsById] = useState<RefsById>({});

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const { collections, customers } = await getCustomerAndCollectionTypes();
      const { types: collectionTypes, refsById } = collections;
      const { types: customerTypes, groups } = customers;

      const rulesList = collectionTypes.map(({ value, title }) => ({
        title,
        value,
        // temp
        groupValue: 1
      }));

      setRefsById(refsById);
      setCollectionRuleList(rulesList);

      if (customerTypes.length > 0 || groups.length > 0) {
        const items: RuleListItem[] = [];

        if (customerTypes.length > 0) {
          items.push({
            title: t("Specific User"),
            value: CUSTOMER_TYPE,
            mode: "specific",
            items: customerTypes
          });
        }

        if (groups.length > 0) {
          items.push({
            title: t("Roles"),
            value: CUSTOMER_TYPE,
            mode: "reference",
            items: groups
          });
        }

        setCustomerRuleList([
          {
            title: t("Users"),
            value: CUSTOMER_TYPE,
            groupValue: 1,
            items
          }
        ]);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const uniqRules = getUniqRules(rules);
      let newRulesList = collectionRuleList;

      await Promise.all(
        uniqRules.map(async rule => {
          if (isCollectionItemRule(rule) || isCollectionTypeRule(rule)) {
            const ruleIndex = getRulesListIndexByRule(collectionRuleList, rule);
            const hasItems = collectionRuleList[ruleIndex]?.items;

            if (ruleIndex === -1 || hasItems) {
              return Promise.resolve();
            }

            const items = await fetchRuleListItems(
              rule,
              newRulesList[ruleIndex]
            );

            newRulesList = setIn(
              newRulesList,
              [ruleIndex, "items"],
              items
            ) as RuleList[];
          }

          return Promise.resolve();
        })
      );

      setCollectionRuleList(disableAlreadyUsedRules(rules, newRulesList));
      setListLoading(false);
    }

    if (rules === null) {
      // rules from server weren't got yet
      return;
    }

    if (collectionRuleList.length) {
      fetchData();
    }
  }, [rules, collectionRuleList]);

  useEffect(() => {
    setCustomerRuleList(disableAlreadyUsedRules(rules, customerRuleList));
  }, [rules, customerRuleList]);

  return [listLoading, [...collectionRuleList, ...customerRuleList]];

  async function fetchRuleListItems(
    rule: CollectionTypeRule | CollectionItemRule,
    collectionType: RuleList
  ): Promise<RuleListItem[]> {
    // maybe we should union our queries into one!
    const items = await getItems(rule.entityType);

    const ruleList: RuleListItem[] = [
      {
        title: `Specific ${collectionType.title}`,
        value: collectionType.value,
        mode: "specific",
        items
      }
    ];

    const entityType = refsById[rule.entityType];

    if (entityType) {
      await Promise.all(
        entityType.map(async ref => {
          const items = await getItems(ref.value);

          ruleList.push({
            title: ref.title,
            value: ref.value,
            mode: "reference",
            items
          });

          return Promise.resolve();
        })
      );
    }

    return ruleList;
  }
}

async function getItems(
  entityType: CollectionTypeRule["entityType"]
): Promise<RuleList[]> {
  const items = await getCollectionItems(entityType, { status: "all" });

  return items.map(({ id, title }) => ({
    title: title,
    value: id
  }));
}
