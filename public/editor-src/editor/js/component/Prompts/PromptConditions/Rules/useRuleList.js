import { useState, useEffect } from "react";
import { setIn } from "timm";
import { t } from "visual/utils/i18n";
import {
  disableAlreadyUsedRules,
  getUniqRules,
  getRulesListIndexByRule
} from "./utils";
import { getCollectionTypesInfo } from "visual/editorComponents/Posts/toolbarExtendParent/utils";
import { getCollectionItems, getCustomers } from "visual/utils/api";
import { CUSTOMER_TYPE } from "visual/utils/blocks/blocksConditions";

const transformCollectionItems = items =>
  items.map(({ id, title }) => ({
    title: title,
    value: id
  }));

export default function useRuleList(rules) {
  const [collectionRuleList, setCollectionRuleList] = useState([]);
  const [customerRuleList, setCustomerRuleList] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  // it's needed only for cms!
  const [refsById, setRefsById] = useState([]);

  useEffect(() => {
    async function fetchCollectionData() {
      const { collectionTypes, refsById } = await getCollectionTypesInfo();

      let rulesList = collectionTypes.map(({ id, title }) => ({
        title,
        value: id,
        // temp
        groupValue: 1
      }));

      setRefsById(refsById);
      setCollectionRuleList(rulesList);
    }

    async function fetchCustomersData() {
      const items = await fetchCustomersListsItems();

      if (items.length > 0) {
        setCustomerRuleList([
          {
            title: t("Users"),
            value: CUSTOMER_TYPE,
            groupValue: 1,
            items: [
              {
                title: "Specific User",
                value: CUSTOMER_TYPE,
                items
              }
            ]
          }
        ]);
      }
    }

    fetchCollectionData();
    fetchCustomersData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const uniqRules = getUniqRules(rules);
      let collectionNewRulesList = collectionRuleList;

      await Promise.all(
        uniqRules.map(async rule => {
          const ruleIndex = getRulesListIndexByRule(collectionRuleList, rule);
          const hasItems =
            collectionRuleList[ruleIndex] &&
            collectionRuleList[ruleIndex].items;

          if (ruleIndex === -1 || hasItems) {
            return Promise.resolve();
          }

          const items = await fetchRuleListItems(
            rule,
            collectionNewRulesList[ruleIndex]
          );

          collectionNewRulesList = setIn(
            collectionNewRulesList,
            [ruleIndex, "items"],
            items
          );

          return Promise.resolve();
        })
      );

      setCollectionRuleList(
        disableAlreadyUsedRules(rules, collectionNewRulesList)
      );
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

  async function fetchRuleListItems(rule, collectionType) {
    // maybe we shoud union our queries into one!
    let items = await getCollectionItems(rule.entityType, { status: "all" });
    // items = transformCollectionItems(items);

    items = [
      {
        title: `Specific ${collectionType.title}`,
        value: collectionType.value,
        items: transformCollectionItems(items)
      }
    ];

    if (refsById[rule.entityType]) {
      await Promise.all(
        refsById[rule.entityType].map(async ref => {
          const collectionItems = await getCollectionItems(ref.id, {
            status: "all"
          });

          items.push({
            title: ref.title,
            value: ref.id,
            items: transformCollectionItems(collectionItems)
          });

          return Promise.resolve();
        })
      );
    }

    return items;
  }

  async function fetchCustomersListsItems() {
    try {
      const customers = await getCustomers();

      return customers.map(({ id, firstName, lastName, email }) => {
        const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();

        return {
          title: fullName || email,
          value: id
        };
      });
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.log(e);
      }
      return [];
    }
  }
}
