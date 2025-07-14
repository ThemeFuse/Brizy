/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEffect, useMemo, useState } from "react";
import { from, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { setIn } from "timm";
import { isEcwidShop } from "visual/global/Config/types/configs/Base";
import { isCMS, isCloud } from "visual/global/Config/types/configs/Cloud";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Categories } from "visual/libs/EcwidSdk/categories";
import { Products } from "visual/libs/EcwidSdk/products";
import { useConfig } from "visual/providers/ConfigProvider";
import {
  CollectionItemRule,
  CollectionTypeRule,
  Rule
} from "visual/types/Rule";
import { getConditionalItems, getConditionalTypes } from "visual/utils/api";
import {
  CUSTOMER_TYPE,
  createEntityValue,
  createEntityValueAll
} from "visual/utils/blocks/blocksConditions";
import {
  isCollectionItemRule,
  isCollectionTypeRule
} from "visual/utils/blocks/guards";
import {
  ECWID_PRODUCT_CATEGORY_TYPE,
  ECWID_PRODUCT_TYPE
} from "visual/utils/ecwid";
import { isOneOf } from "visual/utils/fp/isOneOf";
import { t } from "visual/utils/i18n";
import { CmsListItem, RuleList, RuleListItem } from "./types";
import {
  convertCustomerGroupIdToValue,
  convertCustomerIdToValue,
  convertIdToValue,
  disableAlreadyUsedRules,
  getRefsById,
  getRulesListIndexByRule,
  getUniqRules
} from "./utils";
import { Refs as RefsById } from "./utils/api";

export default function useRuleList(
  rules: Rule[],
  // @ts-expect-error: This type used right now only in WP
  type: "popup" | "block" //eslint-disable-line @typescript-eslint/no-unused-vars
): [boolean, RuleList[]] {
  const [collectionRuleList, setCollectionRuleList] = useState<RuleList[]>([]);
  const [customerRuleList, setCustomerRuleList] = useState<RuleList[]>([]);
  const [ecwidProductsList, setEcwidProductsList] = useState<
    | { type: "ready"; items: CmsListItem[] }
    | { type: "init"; items?: CmsListItem[] }
    | { type: "loading"; items?: CmsListItem[] }
  >({ type: "init" });

  const [ecwidCategoriesList, setEcwidCategoriesList] = useState<
    | { type: "ready"; items: CmsListItem[] }
    | { type: "init"; items?: CmsListItem[] }
    | { type: "loading"; items?: CmsListItem[] }
  >({ type: "init" });

  const [listLoading, setListLoading] = useState(true);

  const config = useConfig();

  // it's needed only for cms!
  const [refsById, setRefsById] = useState<RefsById>({});

  const { type: currentTypeProducts, items: currentItemsProducts } =
    ecwidProductsList;
  const { type: currentTypeCategories, items: currentItemsCategories } =
    ecwidCategoriesList;

  const _isCloud = isCloud(config);
  const _isCMS = _isCloud && isCMS(config);
  const shopModules =
    _isCMS && config?.modules?.shop && isEcwidShop(config.modules.shop)
      ? config?.modules?.shop
      : undefined;
  const shopModulesApiUrl = shopModules?.apiUrl;

  const ecwidProductsClient = useMemo((): Products | undefined => {
    if (shopModulesApiUrl) {
      return new Products();
    }

    return undefined;
  }, [shopModulesApiUrl]);
  const ecwidCategoriesClient = useMemo((): Categories | undefined => {
    if (shopModulesApiUrl) {
      return new Categories();
    }

    return undefined;
  }, [shopModulesApiUrl]);
  const ecwidProductsRules = useMemo((): RuleList[] => {
    if (!ecwidProductsClient) {
      return [];
    }

    switch (currentTypeProducts) {
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
            items: currentItemsProducts
          }
        ];
    }
  }, [currentItemsProducts, ecwidProductsClient, currentTypeProducts]);
  const ecwidCategoriesRules = useMemo((): RuleList[] => {
    if (!ecwidCategoriesClient) {
      return [];
    }

    switch (currentTypeCategories) {
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
            items: currentItemsCategories
          }
        ];
    }
  }, [currentItemsCategories, currentTypeCategories, ecwidCategoriesClient]);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const data = await getConditionalTypes(config);

      const {
        collectionTypes: _collectionTypes,
        customers: customerTypes,
        customerGroups: groups
      } = data;

      const collectionTypes = convertIdToValue(_collectionTypes);

      const refsById = getRefsById(_collectionTypes);

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
            items: convertCustomerIdToValue(customerTypes)
          });
        }

        if (groups.length > 0) {
          items.push({
            title: t("Roles"),
            value: CUSTOMER_TYPE,
            mode: "reference",
            items: convertCustomerGroupIdToValue(groups)
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
  }, [config]);

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
              newRulesList[ruleIndex],
              refsById,
              config
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
  }, [rules, collectionRuleList, refsById, config]);

  useEffect(() => {
    setCustomerRuleList(disableAlreadyUsedRules(rules, customerRuleList));
  }, [rules, customerRuleList]);

  useEffect(() => {
    if (
      ecwidProductsClient &&
      currentTypeProducts === "init" &&
      rules
        .filter(isOneOf([isCollectionTypeRule, isCollectionItemRule]))
        .some((r) => r.entityType === ECWID_PRODUCT_TYPE)
    ) {
      setEcwidProductsList({ type: "loading" });
      setListLoading(true);
      const fetch$ = from(ecwidProductsClient.search(config))
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
          map((items) => ({ type: "ready", items }) as const),
          tap(() => setListLoading(false))
        )
        .subscribe(setEcwidProductsList);

      return () => fetch$.unsubscribe();
    }
  }, [rules, ecwidProductsClient, currentTypeProducts, config]);

  useEffect(() => {
    if (
      ecwidCategoriesClient &&
      currentTypeCategories === "init" &&
      rules
        .filter(isOneOf([isCollectionTypeRule, isCollectionItemRule]))
        .some((r) => r.entityType === ECWID_PRODUCT_CATEGORY_TYPE)
    ) {
      setEcwidCategoriesList({ type: "loading" });
      setListLoading(true);
      const fetch$ = from(ecwidCategoriesClient.search(config))
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
          map((items) => ({ type: "ready", items }) as const),
          tap(() => setListLoading(false))
        )
        .subscribe(setEcwidCategoriesList);

      return () => fetch$.unsubscribe();
    }
  }, [rules, ecwidCategoriesClient, currentTypeCategories, config]);

  return [
    listLoading,
    [
      ...collectionRuleList,
      ...customerRuleList,
      ...ecwidProductsRules,
      ...ecwidCategoriesRules
    ]
  ];
}

async function getItems(
  entityType: string,
  config: ConfigCommon
): Promise<RuleList[]> {
  const items = await getConditionalItems(entityType, config);

  return items.map(({ id, title, status }) => ({
    title: title,
    value: id,
    status
  }));
}

async function fetchRuleListItems(
  rule: CollectionTypeRule | CollectionItemRule,
  collectionType: RuleList,
  refsById: RefsById,
  config: ConfigCommon
): Promise<RuleListItem[]> {
  // maybe we should union our queries into one!
  const items = await getItems(rule.entityType, config);

  const ruleList: RuleListItem[] = [
    {
      title: `${t("Specific")} ${collectionType.title}`,
      value: collectionType.value,
      mode: "specific",
      items
    }
  ];

  const entityType = refsById[rule.entityType];

  if (entityType) {
    await Promise.all(
      entityType.map(
        async (ref: { title: string; fieldId: string; value: string }) => {
          const allReference = [
            {
              title: `${t("All")} ${ref.title}`,
              value: createEntityValueAll({ fieldId: ref.fieldId })
            }
          ];
          const items = await getItems(ref.value, config);
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
        }
      )
    );
  }

  return ruleList;
}
