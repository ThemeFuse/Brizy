import React from "react";
import _ from "underscore";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { getRulesListIndexByRule } from "./utils";

class ConditionGroup extends React.Component {
  static defaultProps = {
    rulesList: [],
    rule: {},
    onGroupChange: _.noop,
    onTypeChange: _.noop
  };

  renderGroupOptions(options) {
    const newOptions = [
      {
        title: "All",
        groupValue: "",
        value: ""
      },
      ...options
    ];

    return newOptions.map(({ title, value, groupValue, disabled }) => (
      <SelectItem
        key={`key-${value}`}
        value={`${groupValue}|${value}`}
        disabled={disabled}
      >
        {title}
      </SelectItem>
    ));
  }

  renderTypeOptions(options) {
    const newOptions = [
      {
        title: "All",
        value: ""
      },
      ...options
    ];
    return newOptions.map(({ title, value, disabled }) => (
      <SelectItem key={`key-${value}`} value={value} disabled={disabled}>
        {title || `No Title #${value}`}
      </SelectItem>
    ));
  }

  render() {
    const { rulesList, rule, onGroupChange, onTypeChange } = this.props;

    const currentRuleIndex = getRulesListIndexByRule(rulesList, rule);
    const currentRule = rulesList[currentRuleIndex];

    return (
      <div className="brz-ed-popup-conditions__select brz-d-xs-flex">
        <Select
          className="brz-control__select--light"
          maxItems={6}
          itemHeight={30}
          defaultValue={`${rule.appliedFor}|${rule.entityType}`}
          onChange={onGroupChange}
        >
          {this.renderGroupOptions(rulesList)}
        </Select>
        {currentRule && currentRule.items && (
          <Select
            defaultValue={rule.entityValues[0]}
            className="brz-control__select--light"
            maxItems={6}
            itemHeight={30}
            onChange={onTypeChange}
          >
            {this.renderTypeOptions(currentRule.items)}
          </Select>
        )}
      </div>
    );
  }
}

export default ConditionGroup;
