import React, { ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { noop } from "underscore";
import EditorIcon from "visual/component/EditorIcon";
import ScrollPane from "visual/component/ScrollPane";
import Config from "visual/global/Config";
import {
  isCMS,
  isCloud,
  isCollectionPage,
  isCustomer,
  isEcwidCategoryPage,
  isEcwidProductPage
} from "visual/global/Config/types/configs/Cloud";
import { pageSelector } from "visual/redux/selectors";
import { AllRule, BlockTypeRule, CollectionTypeRule, Rule } from "visual/types";
import {
  CUSTOMER_TYPE,
  ECWID_PRODUCT_CATEGORY_TYPE,
  ECWID_PRODUCT_TYPE,
  PAGES_GROUP_ID
} from "visual/utils/blocks/blocksConditions";
import { IS_CLOUD, IS_PRO } from "visual/utils/env";
import { t } from "visual/utils/i18n";
import { isPopup } from "visual/utils/models";
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
      syncFail: (data: {
        // TODO: add correct type here
        responseJSON?: {
          data: {
            message: string;
          };
        };
      }) => void;
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
  const [error, setError] = useState<string | null>(null);
  const [listLoading, rulesList] = useRuleList(rules, context);
  const page = useSelector(pageSelector);

  useEffect(() => {
    async function fetchData(getValueFn: AsyncGetValue): Promise<void> {
      let rules = await getValueFn();

      if (IS_CLOUD && !rules) {
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
  }, []);

  function handleAdd(): void {
    if (IS_PRO) {
      const config = Config.getAll();

      if (isPopup(config)) {
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
        if (isCloud(config) && isCMS(config) && isCustomer(config)) {
          newRule.entityType = CUSTOMER_TYPE as NoEmptyString.NoEmptyString;
        }

        setRules([...rules, newRule]);
      }
    }
  }

  function handleChange(): void {
    if (IS_PRO) {
      setLoading(true);
      setError(null);

      onChange({
        data: {
          rules: getUniqRules(rules)
        },
        meta: {
          syncSuccess: (): void => setLoading(false),
          syncFail: (data): void => {
            setLoading(false);
            setError(
              data.responseJSON?.data.message ?? t("Something went wrong")
            );
          }
        }
      });
    }
  }

  function handleConditionChange(rules: Rule[]): void {
    if (IS_PRO) {
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
        <ScrollPane
          style={{
            overflow: "hidden",
            height: "350px"
          }}
          className="brz-ed-scroll--medium brz-ed-scroll--new-dark"
        >
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
        </ScrollPane>
      )}

      {error && <div className="error">{error}</div>}
      <Buttons loading={loading} onChange={handleChange} onClose={onClose} />
    </>
  );
};

export default Rules;
