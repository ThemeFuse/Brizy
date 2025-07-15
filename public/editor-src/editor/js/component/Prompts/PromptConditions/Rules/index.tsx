import { noop } from "es-toolkit";
import React, { ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EditorIcon from "visual/component/EditorIcon";
import { ToastNotification } from "visual/component/Notifications";
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
  CollectionTypeRule,
  Rule
} from "visual/types/Rule";
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
import { getUniqRules } from "./utils";

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
  const page = useSelector(pageSelector);
  const config = useConfig();
  const _isPro = isPro(config);
  const { mode } = useEditorMode();

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

  return (
    <>
      {listLoading ? (
        <div className="brz-ed-popup-conditions__spin">
          <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
        </div>
      ) : (
        <Scrollbar autoHeightMax="350px" theme="light">
          {rules !== null && (
            <ConditionChoices
              rules={rules}
              rulesList={rulesList}
              onChange={handleConditionChange}
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
