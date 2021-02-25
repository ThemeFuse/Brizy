import React, { useState, useEffect } from "react";
import { getStore } from "visual/redux/store";
import { pageSelector } from "visual/redux/selectors";
import EditorIcon from "visual/component/EditorIcon";
import ScrollPane from "visual/component/ScrollPane";
import { IS_CMS } from "visual/utils/env";
import Buttons from "../Buttons";
import ConditionChoices from "./ConditionChoices";
import { filterRules } from "./utils";

import { PAGES_GROUP_ID } from "visual/utils/blocks/blocksConditions";

import useRuleList from "./useRuleList";

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
    const entityType = IS_CMS
      ? pageSelector(getStore().getState()).collectionType.id
      : "page";
    setRules([
      ...rules,
      {
        type: 1,
        appliedFor: PAGES_GROUP_ID,
        entityType: entityType,
        entityValues: []
      }
    ]);
  }

  async function handleChange() {
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

    // getStore().dispatch(
    //   updateRules({
    //     data: filterRules(rules),
    //     meta: {
    //       syncSuccess: () => setLoading(false),
    //       syncFail: data => {
    //         setLoading(false);
    //         setError(data.responseJSON.data.message);
    //       }
    //     }
    //   })
    // );
  }

  return (
    <React.Fragment>
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
              onChange={rules => setRules(rules)}
            />
          )}
          <div
            className="brz-ed-popup-conditions__add-condition"
            onClick={handleAdd}
          >
            <EditorIcon icon="nc-add" /> Add new display condition
          </div>
        </ScrollPane>
      )}

      {error && <div className="error">{error}</div>}
      <Buttons loading={loading} onChange={handleChange} onClose={onClose} />
    </React.Fragment>
  );
}
