/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEffect, useMemo, useState } from "react";
import { from, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { setIn } from "timm";
import Config from "visual/global/Config";
import { isCloud, isCMS } from "visual/global/Config/types/configs/Cloud";
import { Categories } from "visual/libs/EcwidSdk/categories";
import { Products } from "visual/libs/EcwidSdk/products";
import { CollectionItemRule, CollectionTypeRule, Rule } from "visual/types";
import { getCollectionItems } from "visual/utils/api/cms";
import {
  isCollectionItemRule,
  isCollectionTypeRule
} from "visual/utils/blocks";
import {
  createEntityValue,
  createEntityValueAll,
  CUSTOMER_TYPE,
  ECWID_PRODUCT_CATEGORY_TYPE,
  ECWID_PRODUCT_TYPE
} from "visual/utils/blocks/blocksConditions";
import { isOneOf } from "visual/utils/fp/isOneOf";
import { t } from "visual/utils/i18n";
import { CmsListItem, RuleList, RuleListItem } from "./types";
import {
  disableAlreadyUsedRules,
  getRulesListIndexByRule,
  getUniqRules
} from "./utils";
import { getCustomerAndCollectionTypes, Refs as RefsById } from "./utils/api";

export default function useRuleList(
  rules: Rule[],
  // @ts-expect-error: This type used right now only in WP
  type: "popup" | "block" //eslint-disable-line @typescript-eslint/no-unused-vars
): [boolean, RuleList[]] {
  const [collectionRuleList, setCollectionRuleList] = useState<RuleList[]>([]);
  const [customerRuleList, setCustomerRuleList] = useState<RuleList[]>([]);
  const [ecwidProductsList, setEcwidProductsList] = useState<
    | { type: "ready"; items: CmsListItem[] }
    | { type: "init" }
    | { type: "loading" }
  >({ type: "init" });
  const [ecwidCategoriesList, setEcwidCategoriesList] = useState<
    | { type: "ready"; items: CmsListItem[] }
    | { type: "init" }
    | { type: "loading" }
  >({ type: "init" });
  const [listLoading, setListLoading] = useState(true);

  // it's needed only for cms!
  const [refsById, setRefsById] = useState<RefsById>({});

  const ecwidProductsClient = useMemo((): Products | undefined => {
    const config = Config.getAll();

    if (isCloud(config) && isCMS(config) && config.modules?.shop) {
      return new Products(config.modules.shop.apiUrl);
    }

    return undefined;
  }, []);
  const ecwidCategoriesClient = useMemo((): Categories | undefined => {
    const config = Config.getAll();

    if (isCloud(config) && isCMS(config) && config.modules?.shop) {
      return new Categories(config.modules.shop.apiUrl);
    }

    return undefined;
  }, []);
  const ecwidProductsRules = useMemo((): RuleList[] => {
    if (!ecwidProductsClient) {
      return [];
    }

    switch (ecwidProductsList.type) {
      case "init":
      case "loading":
        return [
          {
            title: "Products",
            groupValue: 1,
            value: ECWID_PRODUCT_TYPE,
            items: []
          }
        ];
      case "ready":
        return [
          {
            title: "Products",
            groupValue: 1,
            value: ECWID_PRODUCT_TYPE,
            items: ecwidProductsList.items
          }
        ];
    }
  }, [ecwidProductsList]);
  const ecwidCategoriesRules = useMemo((): RuleList[] => {
    if (!ecwidCategoriesClient) {
      return [];
    }

    switch (ecwidCategoriesList.type) {
      case "init":
      case "loading":
        return [
          {
            title: "Product Categories",
            groupValue: 1,
            value: ECWID_PRODUCT_CATEGORY_TYPE,
            items: []
          }
        ];
      case "ready":
        return [
          {
            title: "Product Categories",
            groupValue: 1,
            value: ECWID_PRODUCT_CATEGORY_TYPE,
            items: ecwidCategoriesList.items
          }
        ];
    }
  }, [ecwidCategoriesList]);

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
        uniqRules.map(async (rule) => {
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
      ecwidProductsClient &&
      ecwidProductsList.type === "init" &&
      rules
        .filter(isOneOf([isCollectionTypeRule, isCollectionItemRule]))
        .some((r) => r.entityType === ECWID_PRODUCT_TYPE)
    ) {
      setEcwidProductsList({ type: "loading" });
      setListLoading(true);
      const fetch$ = from(ecwidProductsClient.search())
        .pipe(
          map((r): CmsListItem[] => {
            return [
              {
                title: t("Specific Product"),
                value: ECWID_PRODUCT_TYPE,
                mode: "specific",
                items: r.items.map((i) => ({
                  title: i.name,
                  value: i.id
                }))
              }
            ];
          }),
          catchError(() => of([])),
          map((items) => ({ type: "ready", items } as const)),
          tap(() => setListLoading(false))
        )
        .subscribe(setEcwidProductsList);

      return () => fetch$.unsubscribe();
    }
  }, [rules]);

  useEffect(() => {
    if (
      ecwidCategoriesClient &&
      ecwidCategoriesList.type === "init" &&
      rules
        .filter(isOneOf([isCollectionTypeRule, isCollectionItemRule]))
        .some((r) => r.entityType === ECWID_PRODUCT_CATEGORY_TYPE)
    ) {
      setEcwidCategoriesList({ type: "loading" });
      setListLoading(true);
      const fetch$ = from(ecwidCategoriesClient.search())
        .pipe(
          map((r): CmsListItem[] => {
            return [
              {
                title: t("Specific Category"),
                value: ECWID_PRODUCT_CATEGORY_TYPE,
                mode: "specific",
                items: r.items.map((i) => ({
                  title: i.name,
                  value: i.id
                }))
              }
            ];
          }),
          catchError(() => of([])),
          map((items) => ({ type: "ready", items } as const)),
          tap(() => setListLoading(false))
        )
        .subscribe(setEcwidCategoriesList);

      return () => fetch$.unsubscribe();
    }
  }, [rules]);

  return [
    listLoading,
    [
      ...collectionRuleList,
      ...customerRuleList,
      ...ecwidProductsRules,
      ...ecwidCategoriesRules
    ]
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
        entityType.map(async (ref) => {
          const allReference = [
            {
              title: `All ${ref.title}`,
              value: createEntityValueAll({ fieldId: ref.fieldId })
            }
          ];
          const items = await getItems(ref.value);
          const itemWithRefId = items.map((i) => ({
            title: i.title,
            value: createEntityValue({
              fieldId: ref.fieldId,
              collectionId: i.value
            })
          }));

          ruleList.push({
            title: ref.title,
            value: ref.value,
            mode: "reference",
            items: [...allReference, ...itemWithRefId]
          });

          return Promise.resolve();
        })
      );
    }

    return ruleList;
  }
}

async function getItems(entityType: string): Promise<RuleList[]> {
  const items = await getCollectionItems(entityType, { status: "all" });

  return items.map(({ id, title, status }) => ({
    title: title,
    value: id,
    status
  }));
}
