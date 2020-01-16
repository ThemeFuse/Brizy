import React, { Component } from "react";
import _ from "underscore";
import { setIn } from "timm";
import EditorIcon from "visual/component/EditorIcon";
import ScrollPane from "visual/component/ScrollPane";
import { getStore } from "visual/redux/store";
import { updateRules } from "visual/redux/actions";
import Buttons from "../Buttons";
import { getUniqRules, getRulesListIndexByRule } from "./utils";
import {
  getConditions,
  getTerms,
  getPostObjects,
  getRulesList
} from "visual/utils/api/editor";
import ConditionChoices from "./ConditionChoices";

const PAGES_GROUP_ID = 1;
const CATEGORIES_GROUP_ID = 2;
const TEMPLATES_GROUP_ID = 16;

const PAGE_TYPE = "page";

export default class Rules extends Component {
  static defaultProps = {
    onChange: _.noop,
    onClose: _.noop
  };

  state = {
    rulesList: [],
    rules: [],
    loading: false,
    listLoading: false,
    error: null
  };

  async componentDidMount() {
    this.setState({ listLoading: true });
    const rules = (await getRulesList()) || [];

    const conditions = await getConditions();

    const rulesList = conditions.map(({ items }) => items).flat();

    this.setState(
      {
        rulesList,
        rules,
        listLoading: false
      },
      this.updateRuleList
    );
  }

  updateRuleList = () => {
    const { rulesList, rules } = this.state;
    const uniqRules = getUniqRules(rules);

    let newRulesList = rulesList;

    uniqRules.forEach(async rule => {
      const ruleIndex = getRulesListIndexByRule(rulesList, rule);

      const group = rule.appliedFor;
      const hasItems = rulesList[ruleIndex] && rulesList[ruleIndex].items;

      if (
        [PAGES_GROUP_ID, CATEGORIES_GROUP_ID, TEMPLATES_GROUP_ID].includes(
          group
        ) &&
        !hasItems
      ) {
        let newItems = [];
        switch (group) {
          case PAGES_GROUP_ID:
          case TEMPLATES_GROUP_ID: {
            const { posts } = await getPostObjects(rule.entityType);
            newItems = posts.map(({ ID, title }) => ({
              title: title,
              value: ID
            }));
            break;
          }
          case CATEGORIES_GROUP_ID: {
            const terms = await getTerms(rule.entityType);
            newItems = terms.map(({ name, term_id }) => ({
              title: name,
              value: term_id
            }));
            break;
          }
        }

        newRulesList = setIn(newRulesList, [ruleIndex, "items"], newItems);
        this.setState({
          rulesList: newRulesList
        });
      }
    });
  };

  handleChange = async () => {
    const { rules } = this.state;

    // remove duplicates
    const newRules = rules
      .filter(function(item, index) {
        return (
          rules.findIndex(
            ({ appliedFor, entityType, entityValues }) =>
              appliedFor === item.appliedFor &&
              entityType === item.entityType &&
              _.isEqual(entityValues, item.entityValues)
          ) >= index
        );
      })
      // eslint-disable-next-line no-unused-vars
      .map(({ id, ...rest }) => rest);

    this.setState({ loading: true, error: null }, () => {
      getStore().dispatch(
        updateRules({
          data: newRules,
          meta: {
            syncSuccess: () => this.setState({ loading: false }),
            syncFail: data => {
              this.setState({
                loading: false,
                error: data.responseJSON.data.message
              });
            }
          }
        })
      );
    });
  };

  handleRuleMatchedChanges = rules => {
    this.setState({ rules }, this.updateRuleList);
  };

  handleAdd = () => {
    const rules = [
      ...this.state.rules,
      {
        type: 1,
        appliedFor: PAGES_GROUP_ID,
        entityType: PAGE_TYPE,
        entityValues: []
      }
    ];

    this.handleRuleMatchedChanges(rules);
  };

  formatedRuleList() {
    const { rules, rulesList } = this.state;
    if (!rulesList.length) return rulesList;

    let newRuleList = rulesList;
    rules.forEach(rule => {
      const ruleIndex = getRulesListIndexByRule(rulesList, rule);

      if (
        rule.appliedFor !== PAGES_GROUP_ID &&
        rule.appliedFor !== CATEGORIES_GROUP_ID
      ) {
        newRuleList = setIn(newRuleList, [ruleIndex, "disabled"], true);
      } else {
        const { items } = newRuleList[ruleIndex];
        if (items && rule.entityValues.length) {
          const itemIndex = items.findIndex(({ value: { globalBlockId } }) =>
            rule.entityValues.includes(globalBlockId)
          );
          if (itemIndex !== -1) {
            newRuleList = setIn(
              newRuleList,
              [ruleIndex, "items", itemIndex, "disabled"],
              true
            );
          }
        }
      }
    });

    return newRuleList;
  }

  render() {
    const { loading, listLoading, error } = this.state;
    const rulesList = this.formatedRuleList();

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
            <ConditionChoices
              rules={this.state.rules}
              rulesList={rulesList}
              onChange={this.handleRuleMatchedChanges}
            />
            <div
              className="brz-ed-popup-conditions__add-condition"
              onClick={this.handleAdd}
            >
              <EditorIcon icon="nc-add" /> Add new display condition
            </div>
          </ScrollPane>
        )}

        {error && <div className="error">{error}</div>}
        <Buttons
          loading={loading}
          onChange={this.handleChange}
          onClose={this.props.onClose}
        />
      </React.Fragment>
    );
  }
}
