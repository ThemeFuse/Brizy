import React from "react";
import { removeAt, setIn } from "timm";
import {
  BlockTypeRule,
  CollectionItemRule,
  CollectionTypeRule,
  Rule
} from "visual/types/Rule";
import ItemWrapper from "../common/ItemWrapper";
import ConditionGroup from "./ConditionGroup";
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

    if (value === null || value === "all") {
      newRule = {
        type: rules[index].type
      };
    } else {
      const [group, type] = value.split("|||");
      newRule = {
        type: rules[index].type,
        entityType: type,
        appliedFor: group === "" || group === null ? null : Number(group)
      };
    }

    onChange(setIn(rules, [index], newRule) as Rule[]);
  };

  handleTypeChange = (value: string | null, index: number): void => {
    const { rules, onChange } = this.props;
    let newRule: Rule;

    if (value === null) {
      const { type, appliedFor, entityType } = rules[
        index
      ] as CollectionTypeRule;

      newRule = {
        type,
        appliedFor,
        entityType
      };
    } else {
      const [mode, v] = value.split("|||");
      const { type, appliedFor, entityType } = rules[
        index
      ] as CollectionItemRule;

      newRule = {
        type,
        appliedFor,
        entityType,
        mode: mode === "reference" ? "reference" : "specific",
        entityValues: v ? [v] : []
      };
    }

    onChange(setIn(rules, [index], newRule) as Rule[]);
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
