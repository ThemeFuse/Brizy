/* eslint-disable @typescript-eslint/no-use-before-define */
import { useState, useEffect, useMemo } from "react";
import { setIn } from "timm";
import { t } from "visual/utils/i18n";
import {
  disableAlreadyUsedRules,
  getUniqRules,
  getRulesListIndexByRule
} from "./utils";
import { getCustomerAndCollectionTypes, Refs as RefsById } from "./utils/api";
import { getCollectionItems } from "visual/utils/api/cms";
import {
  CUSTOMER_TYPE,
  ECWID_PRODUCT_TYPE
} from "visual/utils/blocks/blocksConditions";
import { CollectionItemRule, CollectionTypeRule, Rule } from "visual/types";
import { CmsListItem, RuleList, RuleListItem } from "./types";
import {
  isCollectionItemRule,
  isCollectionTypeRule
} from "visual/utils/blocks";
import { isCloud, isCMS } from "visual/global/Config/types/configs/Cloud";
import Config from "visual/global/Config";
import { isOneOf } from "visual/utils/fp/isOneOf";
import { from, of } from "rxjs";
import { Products } from "visual/libs/EcwidSdk/products";
import { catchError, map, tap } from "rxjs/operators";

export default function useRuleList(rules: Rule[]): [boolean, RuleList[]] {
  const [collectionRuleList, setCollectionRuleList] = useState<RuleList[]>([]);
  const [customerRuleList, setCustomerRuleList] = useState<RuleList[]>([]);
  const [ecwidProductsList, setEcwidProductsList] = useState<
    | { type: "ready"; items: CmsListItem[] }
    | { type: "init" }
    | { type: "loading" }
  >({ type: "init" });
  const [listLoading, setListLoading] = useState(true);

  // it's needed only for cms!
  const [refsById, setRefsById] = useState<RefsById>({});

  const ecwidClient = useMemo((): Products | undefined => {
    const config = Config.getAll();

    if (isCloud(config) && isCMS(config) && config.modules?.shop) {
      return new Products(config.modules.shop.apiUrl);
    }

    return undefined;
  }, []);
  const ecwidRules = useMemo((): RuleList[] => {
    if (!ecwidClient) {
      return [];
    }

    switch (ecwidProductsList.type) {
      case "init":
      case "loading":
        return [
          {
            title: "Ecwid",
            groupValue: 1,
            value: ECWID_PRODUCT_TYPE,
            items: []
          }
        ];
      case "ready":
        return [
          {
            title: "Ecwid",
            groupValue: 1,
            value: ECWID_PRODUCT_TYPE,
            items: ecwidProductsList.items
          }
        ];
    }
  }, [ecwidProductsList]);

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

  useEffect(() => {
    if (
      ecwidClient &&
      ecwidProductsList.type === "init" &&
      rules
        .filter(isOneOf([isCollectionTypeRule, isCollectionItemRule]))
        .some(r => r.entityType === ECWID_PRODUCT_TYPE)
    ) {
      setEcwidProductsList({ type: "loading" });
      setListLoading(true);
      const fetch$ = from(ecwidClient.search())
        .pipe(
          map((r): CmsListItem[] => {
            return [
              {
                title: t("Specific Product"),
                value: ECWID_PRODUCT_TYPE,
                mode: "specific",
                items: r.items.map(i => ({
                  title: i.name,
                  value: i.id
                }))
              }
            ];
          }),
          catchError(() => of([])),
          map(items => ({ type: "ready", items } as const)),
          tap(() => setListLoading(false))
        )
        .subscribe(setEcwidProductsList);

      return () => fetch$.unsubscribe();
    }
  }, [rules]);

  return [
    listLoading,
    [...collectionRuleList, ...customerRuleList, ...ecwidRules]
  ];

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
