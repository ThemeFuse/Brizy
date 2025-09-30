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
import { DeletedRuleNotification } from "./DeletedRuleNotification";
import { RuleList, ValueItems } from "./types";

export const getValidRules = (rules: Rule[], rulesList: RuleList[]): Rule[] => {
  const rulesListValues = new Set(rulesList.map((item) => String(item.value)));

  const availableEntityValues = new Set<string>();

  rulesList.forEach((ruleListItem) => {
    if (ruleListItem.items) {
      ruleListItem.items.forEach((item) => {
        // Add direct item values
        if (item.value) {
          availableEntityValues.add(String(item.value));
        }
        
        // Add nested item values  
        if ("items" in item && Array.isArray(item.items)) {
          item.items.forEach((valueItem) => {
            availableEntityValues.add(String(valueItem.value));
          });
        }
      });
    }
  });

  return rules.map((rule) => {
    const hasInvalidEntityType =
      "entityType" in rule && !rulesListValues.has(String(rule.entityType));

    const hasInvalidEntityValues =
      "entityValues" in rule &&
      rule.entityValues &&
      rule.entityValues.length > 0 &&
      !rule.entityValues.some((entityValue) =>
        availableEntityValues.has(String(entityValue))
      );

    if (hasInvalidEntityType || hasInvalidEntityValues) {
      return {
        ...rule,
        deleted: true
      };
    }

    return rule;
  });
};

export interface Props {
  rules: Rule[];
  rulesList: RuleList[];
  onChange: (rules: Rule[]) => void;
  getItems: (collectionType: string, search: string) => Promise<ValueItems[]>;
  addRuleToTheList: (item: CollectionItemRule) => void;
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
    const { rules, onChange, addRuleToTheList } = this.props;
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

      addRuleToTheList(newRule);
    }

    onChange(setIn(rules, [index], newRule) as Rule[]);
  };

  render(): JSX.Element[] {
    const { rules, rulesList, getItems, addRuleToTheList } = this.props;

    return getValidRules(rules, rulesList).map((rule, index) => {
      const isInclude = rule.type === BlockTypeRule.include;

      return rule.deleted ? (
        <DeletedRuleNotification
          key={index}
          onRemove={(): void => this.handleRemove(index)}
        />
      ) : (
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
            getItems={getItems}
            addRuleToTheList={addRuleToTheList}
          />
        </ItemWrapper>
      );
    });
  }
}

export default ConditionChoices;
