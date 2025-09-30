import { noop } from "es-toolkit";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import EditorIcon from "visual/component/EditorIcon";
import { ToastNotification } from "visual/component/Notifications";
import {
  CmsListItem,
  RuleList,
  ValueItems
} from "visual/component/Prompts/PromptConditions/Rules/types";
import { Scrollbar } from "visual/component/Scrollbar";
import { isCustomerPage } from "visual/global/Config/types/configs/Base";
import {
  isCloud,
  isCollectionPage,
  isEcwidCategoryPage,
  isEcwidProductPage
} from "visual/global/Config/types/configs/Cloud";
import { useConfig } from "visual/providers/ConfigProvider";
import { isPopup, useEditorMode } from "visual/providers/EditorModeProvider";
import { pageSelector } from "visual/redux/selectors";
import {
  AllRule,
  BlockTypeRule,
  CollectionItemRule,
  CollectionTypeRule,
  Rule
} from "visual/types/Rule";
import { getConditionalItems } from "visual/utils/api";
import { pendingRequest } from "visual/utils/api";
import {
  CUSTOMER_TYPE,
  PAGES_GROUP_ID
} from "visual/utils/blocks/blocksConditions";
import {
  ECWID_PRODUCT_CATEGORY_TYPE,
  ECWID_PRODUCT_TYPE
} from "visual/utils/ecwid";
import { isPro } from "visual/utils/env";
import { t } from "visual/utils/i18n";
import * as NoEmptyString from "visual/utils/string/NoEmptyString";
import Buttons from "../Buttons";
import ConditionChoices from "./ConditionChoices";
import useRuleList from "./useRuleList";
import { getItemsIndex, getRulesListIndexByRule, getUniqRules } from "./utils";

type AsyncGetValue = () => Rule[];

interface Props {
  value: Rule[];
  context: "popup" | "block";
  asyncGetValue?: AsyncGetValue;
  onClose: VoidFunction;
  onChange: (data: {
    data: {
      rules: Rule[];
    };
    meta: {
      syncSuccess: () => void;
      syncFail: (data: { message?: string }) => void;
    };
  }) => void;
}

const Rules = (props: Props): ReactElement => {
  const {
    context,
    value = [],
    asyncGetValue,
    onClose = noop,
    onChange = noop
  } = props;
  const [rules, setRules] = useState(value);
  const [loading, setLoading] = useState(false);
  const [listLoading, rulesList] = useRuleList(rules, context);
  const [currentRuleList, setCurrentRuleList] = useState<RuleList[]>([]);
  const [searchItems, setSearchItems] = useState<ValueItems[]>([]);
  const page = useSelector(pageSelector);
  const config = useConfig();
  const _isPro = isPro(config);
  const { mode } = useEditorMode();

  const stringifiedJson = JSON.stringify(rulesList);

  const memoizedRulesList = useMemo(() => {
    try {
      return JSON.parse(stringifiedJson);
    } catch (e) {
      console.error("Something went wrong while searching Rules", e);
    }
  }, [stringifiedJson]);

  useEffect(() => {
    async function fetchData(getValueFn: AsyncGetValue): Promise<void> {
      let rules = await getValueFn();

      if (isCloud(config) && !rules) {
        rules = [
          {
            type: 1
          }
        ];
      } else if (!rules) {
        rules = [];
      }

      setRules(rules);
    }

    asyncGetValue && fetchData(asyncGetValue);
  }, [config, asyncGetValue]);

  function handleAdd(): void {
    if (_isPro) {
      if (isPopup(mode)) {
        const rule: AllRule = {
          type: BlockTypeRule.include
        };
        setRules([...rules, rule]);
      } else {
        const newRule: CollectionTypeRule = {
          type: BlockTypeRule.include,
          appliedFor: PAGES_GROUP_ID,
          entityType: "page" as NoEmptyString.NoEmptyString
        };

        if (
          isCollectionPage(page) &&
          NoEmptyString.is(page.collectionType.id)
        ) {
          newRule.entityType = page.collectionType.id;
        }

        if (isEcwidProductPage(page)) {
          newRule.entityType =
            ECWID_PRODUCT_TYPE as NoEmptyString.NoEmptyString;
        }
        if (isEcwidCategoryPage(page)) {
          newRule.entityType =
            ECWID_PRODUCT_CATEGORY_TYPE as NoEmptyString.NoEmptyString;
        }
        if (isCloud(config) && isCustomerPage(config.page)) {
          newRule.entityType = CUSTOMER_TYPE as NoEmptyString.NoEmptyString;
        }

        setRules([...rules, newRule]);
      }
    }
  }

  function handleChange(): void {
    if (_isPro) {
      setLoading(true);

      onChange({
        data: {
          rules: getUniqRules(rules)
        },
        meta: {
          syncSuccess: async (): Promise<void> => {
            await pendingRequest(100);
            setLoading(false);
          },
          syncFail: (data): void => {
            setLoading(false);
            ToastNotification.error(data.message ?? t("Something went wrong"));
          }
        }
      });
    }
  }

  function handleConditionChange(rules: Rule[]): void {
    if (_isPro) {
      setRules(rules);
    }
  }

  const getItems = async (
    collectionType: string,
    search: string
  ): Promise<ValueItems[]> => {
    const items = await getConditionalItems(collectionType, config, search);

    const convertedItems = items.map((item) => ({
      value: item.id,
      status: item.status,
      title: item.title
    }));

    setSearchItems(convertedItems);

    return convertedItems;
  };

  const addRuleToTheList = (item: CollectionItemRule) => {
    const ruleIndex = getRulesListIndexByRule(currentRuleList, item);

    const matchingItems = searchItems.filter((searchItem) =>
      item.entityValues.includes(searchItem.value)
    );

    const itemExists =
      currentRuleList
        .find((currentItem) => currentItem.value === item.entityType)
        ?.items?.some((subItemCurrent) =>
          subItemCurrent.items?.some(
            (subSubItemCurrent) =>
              subSubItemCurrent.value === item.entityValues[0]
          )
        ) || false;

    if (!itemExists) {
      setCurrentRuleList((prev) => {
        const currentRule = prev[ruleIndex];

        if (!currentRule) return prev;

        const items = currentRule.items || [];

        const itemIndex = getItemsIndex(items, item.entityType);

        const firstItem = items[itemIndex] as CmsListItem;

        if (!firstItem) return prev;

        const existingItems = firstItem.items || [];

        const updatedRule = {
          ...currentRule,
          items: [
            {
              ...firstItem,
              items: [...existingItems, ...matchingItems]
            }
          ]
        };

        return prev.map((rule, index) =>
          index === ruleIndex ? updatedRule : rule
        );
      });
    }
  };

  useEffect(() => {
    if (!listLoading) {
      setCurrentRuleList(memoizedRulesList);
    }
  }, [listLoading, memoizedRulesList]);

  return (
    <>
      {listLoading ? (
        <div className="brz-ed-popup-conditions__spin">
          <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
        </div>
      ) : (
        <Scrollbar autoHeightMax="350px" theme="light">
          {rules !== null && rulesList.length > 0 && (
            <ConditionChoices
              rules={rules}
              rulesList={currentRuleList}
              onChange={handleConditionChange}
              getItems={getItems}
              addRuleToTheList={addRuleToTheList}
            />
          )}
          <div
            className="brz-ed-popup-conditions__add-condition"
            onClick={handleAdd}
          >
            <EditorIcon icon="nc-add" /> {t("Add new display condition")}
          </div>
        </Scrollbar>
      )}

      <Buttons loading={loading} onChange={handleChange} onClose={onClose} />
    </>
  );
};

export default Rules;
