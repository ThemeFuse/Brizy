import React from "react";
import { removeAt, setIn } from "timm";
import ItemWrapper from "../common/ItemWrapper";
import ConditionGroup from "./ConditionGroup";
import { BlockTypeRule, Rule } from "visual/types";
import { RuleList } from "./types";

export interface Props {
  rules: Rule[];
  rulesList: RuleList[];
  onChange: (rules: Rule[]) => void;
}

class ConditionChoices extends React.Component<Props> {
  handleRemove = (index: number): void => {
    this.props.onChange(removeAt(this.props.rules, index));
  };

  handleVisibilityTypeChange = (index: number, type: boolean): void => {
    const { rules, onChange } = this.props;
    const newType = type ? BlockTypeRule.include : BlockTypeRule.exclude;

    onChange(setIn(rules, [index, "type"], newType) as Rule[]);
  };

  handleGroupChange = (value: string | null, index: number): void => {
    const { rules, onChange } = this.props;
    let newRule: Rule;

    if (value === null) {
      newRule = {
        type: rules[index].type
      };
    } else {
      const [group, type] = value.split("|");
      newRule = {
        ...rules[index],
        entityType: type,
        appliedFor: group === "" || group === null ? null : Number(group),
        entityValues: []
      };
    }

    onChange(setIn(rules, [index], newRule) as Rule[]);
  };

  handleTypeChange = (value: string | null, index: number): void => {
    const { rules, onChange } = this.props;
    const newValue = value ? [value] : [];

    onChange(setIn(rules, [index, "entityValues"], newValue) as Rule[]);
  };

  render(): JSX.Element[] {
    const { rules, rulesList } = this.props;

    return rules.map((rule, index) => {
      const isInclude = rule.type === BlockTypeRule.include;

      return (
        <ItemWrapper
          key={index}
          active={isInclude}
          onChange={(): void =>
            this.handleVisibilityTypeChange(index, !isInclude)
          }
          onRemove={(): void => this.handleRemove(index)}
        >
          <ConditionGroup
            rule={rule}
            rulesList={rulesList}
            onGroupChange={(value: string | null): void =>
              this.handleGroupChange(value, index)
            }
            onTypeChange={(value: string | null): void =>
              this.handleTypeChange(value, index)
            }
          />
        </ItemWrapper>
      );
    });
  }
}

export default ConditionChoices;
