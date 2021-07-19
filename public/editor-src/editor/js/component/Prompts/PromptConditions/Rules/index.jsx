import React, { useState, useEffect } from "react";
import { getStore } from "visual/redux/store";
import { pageSelector } from "visual/redux/selectors";
import EditorIcon from "visual/component/EditorIcon";
import ScrollPane from "visual/component/ScrollPane";
import { IS_CMS, IS_PRO } from "visual/utils/env";
import { IS_GLOBAL_POPUP } from "visual/utils/models";
import Buttons from "../Buttons";
import ConditionChoices from "./ConditionChoices";
import { filterRules } from "./utils";

import { PAGES_GROUP_ID } from "visual/utils/blocks/blocksConditions";

import useRuleList from "./useRuleList";
import { t } from "visual/utils/i18n";

export default function Rules({
  value = null,
  asyncGetValue,
  onClose = () => {},
  onChange = () => {}
}) {
  const [rules, setRules] = useState(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listLoading, rulesList] = useRuleList(rules);

  useEffect(() => {
    async function fetchData() {
      let rules = await asyncGetValue();

      if (IS_CMS && !rules) {
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

    asyncGetValue && fetchData();
  }, []);

  function handleAdd() {
    if (IS_PRO) {
      let newRule = {
        type: 1,
        appliedFor: PAGES_GROUP_ID,
        entityType: "page",
        entityValues: []
      };

      if (IS_CMS) {
        newRule.entityType = pageSelector(
          getStore().getState()
        ).collectionType.id;
      }

      if (IS_GLOBAL_POPUP) {
        newRule.appliedFor = null;
        newRule.entityType = "";
      }

      setRules([...rules, newRule]);
    }
  }

  function handleChange() {
    if (IS_PRO) {
      setLoading(true);
      setError(null);

      onChange({
        data: {
          rules: filterRules(rules)
        },
        meta: {
          syncSuccess: () => setLoading(false),
          syncFail: data => {
            setLoading(false);
            setError(data.responseJSON.data.message);
          }
        }
      });
    }
  }

  function handleConditionChange(rules) {
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
}
