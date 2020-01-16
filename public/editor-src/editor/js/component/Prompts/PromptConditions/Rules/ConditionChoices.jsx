import React from "react";
import _ from "underscore";
import { setIn, removeAt } from "timm";
import ItemWrapper from "../common/ItemWrapper";
import ConditionGroup from "./ConditionGroup";

const TYPE_INCLUDE = 1;
const TYPE_EXCLUDE = 2;

class ConditionChoices extends React.Component {
  static defaultProps = {
    rules: [],
    rulesList: [],
    onChange: _.noop
  };

  handleRemove = index => {
    this.props.onChange(removeAt(this.props.rules, index));
  };

  handleVisibilityTypeChange = (index, type) => {
    type = type ? TYPE_INCLUDE : TYPE_EXCLUDE;
    const rules = setIn(this.props.rules, [index, "type"], Number(type));

    this.props.onChange(rules);
  };

  handleGroupChange = (value, index) => {
    const { rules } = this.props;
    let [group, type] = value.split("|");
    const ruleMatch = {
      ...rules[index],
      entityType: type,
      appliedFor: group === "" ? "" : Number(group),
      entityValues: []
    };

    this.props.onChange(setIn(rules, [index], ruleMatch));
  };

  handleTypeChange = (value, index) => {
    const { rules } = this.props;
    const newValue = value ? [value] : [];
    this.props.onChange(setIn(rules, [index, "entityValues"], newValue));
  };

  render() {
    const { rules, rulesList } = this.props;

    return rules.map(({ type, ...rule }, index) => {
      const isInclude = type === TYPE_INCLUDE;
      return (
        <ItemWrapper
          key={index}
          active={isInclude}
          index={index}
          onChange={() => this.handleVisibilityTypeChange(index, !isInclude)}
          onRemove={() => this.handleRemove(index)}
        >
          <ConditionGroup
            rule={rule}
            rulesList={rulesList}
            onGroupChange={value => this.handleGroupChange(value, index)}
            onTypeChange={value => this.handleTypeChange(value, index)}
          />
        </ItemWrapper>
      );
    });
  }
}

export default ConditionChoices;
