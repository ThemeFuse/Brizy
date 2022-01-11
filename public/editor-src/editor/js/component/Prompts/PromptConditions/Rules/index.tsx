import React, { useState, useEffect, ReactElement } from "react";
import { useSelector } from "react-redux";
import { noop } from "underscore";
import { pageSelector } from "visual/redux/selectors";
import Config from "visual/global/Config";
import EditorIcon from "visual/component/EditorIcon";
import ScrollPane from "visual/component/ScrollPane";
import { IS_CLOUD, IS_PRO } from "visual/utils/env";
import { IS_GLOBAL_POPUP } from "visual/utils/models";
import Buttons from "../Buttons";
import ConditionChoices from "./ConditionChoices";
import { filterRules } from "./utils";
import { Rule, CollectionTypeRule } from "visual/types";
import {
  CUSTOMER_TYPE,
  PAGES_GROUP_ID
} from "visual/utils/blocks/blocksConditions";

import useRuleList from "./useRuleList";
import { t } from "visual/utils/i18n";
import {
  isCloud,
  isCMS,
  isCollectionPage,
  isCustomer
} from "visual/global/Config/types/configs/Cloud";

type AsyncGetValue = () => Rule[];

interface Props {
  value: Rule[];
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
  const { value = [], asyncGetValue, onClose = noop, onChange = noop } = props;
  const [rules, setRules] = useState(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listLoading, rulesList] = useRuleList(rules);
  const page = useSelector(pageSelector);

  useEffect(() => {
    async function fetchData(getValueFn: AsyncGetValue): Promise<void> {
      let rules = await getValueFn();

      if (IS_CLOUD && !rules) {
        rules = [
          {
            type: 1,
            appliedFor: null,
            entityType: "",
            entityValues: []
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
      const newRule: CollectionTypeRule = {
        type: 1,
        appliedFor: PAGES_GROUP_ID,
        entityType: "page",
        entityValues: []
      };

      if (isCollectionPage(page)) {
        newRule.entityType = page.collectionType.id;
      }

      if (isCloud(config) && isCMS(config) && isCustomer(config)) {
        newRule.entityType = CUSTOMER_TYPE;
      }

      if (IS_GLOBAL_POPUP) {
        newRule.appliedFor = null;
        newRule.entityType = "";
      }

      setRules([...rules, newRule]);
    }
  }

  function handleChange(): void {
    if (IS_PRO) {
      setLoading(true);
      setError(null);

      onChange({
        data: {
          rules: filterRules(rules)
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
