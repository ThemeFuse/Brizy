import React from "react";
import SelectOptgroup from "visual/component/Controls/Select/SelectOptgroup";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { Badge } from "visual/component/Badge";
import { getRulesListIndexByRule } from "./utils";
import { isLegacyRuleListItem, RuleList, RuleListItem } from "./types";
import { Rule } from "visual/types";
import {
  isCollectionItemRule,
  isCollectionTypeRule
} from "visual/utils/blocks";

export interface Props {
  rule: Rule;
  rulesList: RuleList[];
  onGroupChange: (v: string | null) => void;
  onTypeChange: (v: string | null) => void;
}

class ConditionGroup extends React.Component<Props> {
  renderGroupOptions(options: RuleList[]): JSX.Element[] {
    const allOption = (
      <SelectItem key="all" value="|">
        All
      </SelectItem>
    );
    const newOptions = options.map(({ title, value, groupValue, disabled }) => (
      <SelectItem
        key={`key-${value}`}
        value={`${groupValue}|${value}`}
        disabled={disabled}
      >
        {title}
      </SelectItem>
    ));

    return [allOption, ...newOptions];
  }

  renderTypeOptions(items: RuleListItem[]): JSX.Element[] {
    const allOption = (
      <SelectItem key="all" value="">
        All
      </SelectItem>
    );
    const newItems = items.map(item =>
      isLegacyRuleListItem(item) ? (
        <SelectItem key={item.value} value={String(item.value)}>
          {item.title}
          {item.status && <Badge status={item.status} />}
        </SelectItem>
      ) : (
        <SelectOptgroup
          key={item.value}
          title={item.title}
          items={item.items.map(item => (
            <SelectItem key={item.value} value={String(item.value)}>
              {item.title}
              {item.status && <Badge status={item.status} />}
            </SelectItem>
          ))}
        >
          <span className="brz-span">{item.title}</span>
        </SelectOptgroup>
      )
    );

    return [allOption, ...newItems];
  }

  render(): JSX.Element {
    const { rulesList, rule, onGroupChange, onTypeChange } = this.props;

    let currentRuleList: RuleList | null = null;
    let groupDV: string | null = null;

    if (isCollectionItemRule(rule) || isCollectionTypeRule(rule)) {
      const currentRuleListIndex = getRulesListIndexByRule(rulesList, rule);
      currentRuleList = rulesList[currentRuleListIndex];
      groupDV = `${rule.appliedFor}|${rule.entityType}`;
    }

    return (
      <div className="brz-ed-popup-conditions__select brz-d-xs-flex">
        <Select
          className="brz-control__select--white"
          maxItems={6}
          itemHeight={30}
          defaultValue={groupDV}
          inPortal={true}
          onChange={onGroupChange}
        >
          {this.renderGroupOptions(rulesList)}
        </Select>
        {currentRuleList && currentRuleList.items && (
          <Select
            defaultValue={
              isCollectionItemRule(rule) ? `${rule.entityValues[0]}` : null
            }
            className="brz-control__select--white"
            maxItems={6}
            itemHeight={30}
            inPortal={true}
            onChange={onTypeChange}
          >
            {this.renderTypeOptions(currentRuleList.items)}
          </Select>
        )}
      </div>
    );
  }
}

export default ConditionGroup;
