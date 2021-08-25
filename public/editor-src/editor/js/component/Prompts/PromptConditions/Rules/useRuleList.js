import { useState, useEffect } from "react";
import { setIn } from "timm";
import {
  disableAlreadyUsedRules,
  getUniqRules,
  getRulesListIndexByRule
} from "./utils";

import { getCollectionTypesInfo } from "visual/editorComponents/Posts/toolbarExtendParent/utils";

import { getCollectionItems } from "visual/utils/api";

const transformCollectionItems = items =>
  items.map(({ id, title }) => ({
    title: title,
    value: id
  }));

export default function useRuleList(rules) {
  const [rulesList, setRulesList] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  // it's needed only for cms!
  const [refsById, setRefsById] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { collectionTypes, refsById } = await getCollectionTypesInfo();

      let rulesList = collectionTypes.map(({ id, title }) => ({
        title,
        value: id,
        // temp
        groupValue: 1
      }));

      setRefsById(refsById);
      setRulesList(rulesList);
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const uniqRules = getUniqRules(rules);
      let newRulesList = rulesList;

      await Promise.all(
        uniqRules.map(async rule => {
          const ruleIndex = getRulesListIndexByRule(rulesList, rule);
          const hasItems = rulesList[ruleIndex] && rulesList[ruleIndex].items;

          if (ruleIndex === -1 || hasItems) {
            return Promise.resolve();
          }

          const items = await fetchRuleListItems(rule, newRulesList[ruleIndex]);

          newRulesList = setIn(newRulesList, [ruleIndex, "items"], items);

          return Promise.resolve();
        })
      );

      setRulesList(disableAlreadyUsedRules(rules, newRulesList));
      setListLoading(false);
    }

    if (rules === null) {
      // rules from server weren't got yet
      return;
    }

    if (rulesList.length) {
      fetchData();
    }
  }, [rules, rulesList]);

  return [listLoading, rulesList];

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
}
