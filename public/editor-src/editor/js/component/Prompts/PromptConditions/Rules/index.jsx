import React, { useState, useEffect } from "react";

import EditorIcon from "visual/component/EditorIcon";
import ScrollPane from "visual/component/ScrollPane";
import { IS_PRO } from "visual/utils/models/modes";
import Buttons from "../Buttons";
// import { getRulesList } from "visual/utils/api/editor";
import ConditionChoices from "./ConditionChoices";
import { filterRules, PAGES_GROUP_ID, PAGE_TYPE } from "./utils";

import useRuleList from "./useRuleList";
import { t } from "visual/utils/i18n";

export default function Rules({
  value = [],
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
      const rules = (await asyncGetValue()) || [];

      setRules(rules);
    }

    asyncGetValue && fetchData();
  }, []);

  function handleAdd() {
    if (IS_PRO) {
      setRules([
        ...rules,
        {
          type: 1,
          appliedFor: PAGES_GROUP_ID,
          entityType: PAGE_TYPE,
          entityValues: []
        }
      ]);
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
          <ConditionChoices
            rules={rules}
            rulesList={rulesList}
            onChange={handleConditionChange}
          />
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
