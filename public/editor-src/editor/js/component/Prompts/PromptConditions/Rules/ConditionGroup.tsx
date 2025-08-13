import classNames from "classnames";
import React from "react";
import { SelectItem } from "visual/component/Controls/InternalLink/Components/SelectItem";
import { Select2 } from "visual/component/Controls/Select2";
import { Item } from "visual/component/Controls/Select2/Item";
import { CollectionItemRule, Rule } from "visual/types/Rule";
import {
  isCollectionItemRule,
  isCollectionTypeRule
} from "visual/utils/blocks/guards";
import { t } from "visual/utils/i18n";
import { MValue } from "visual/utils/value";
import { ControlTypeOptions } from "../common/ControlTypeOptions";
import { LegacyRuleList } from "../common/LegacyRuleList";
import { ListItems } from "../common/ListItems";
import {
  RuleList,
  RuleListItem,
  ValueItems,
  isLegacyRuleListItem
} from "./types";
import { getRulesListIndexByRule } from "./utils";
import { getValue } from "./utils/index";

interface ConditionGroupProps {
  rule: Rule;
  rulesList: RuleList[];
  onGroupChange: (v: string | null) => void;
  onTypeChange: (v: string | null) => void;
  getItems: (collectionType: string, search: string) => Promise<ValueItems[]>;
  addRuleToTheList: (item: CollectionItemRule) => void;
}

const ALL = "all";

class ConditionGroup extends React.Component<ConditionGroupProps> {
  state = {
    isOpen: false,
    filteredItems: undefined,
    loading: false
  };

  renderGroupOptions(
    options: RuleList[],
    groupDV: string | null
  ): JSX.Element[] {
    const _className = classNames({
      "brz-ed-controls-multiSelect-all": groupDV === null
    });

    const optionAll = (
      <Item<string> key={ALL} value={ALL}>
        <div className={_className}>
          <span title={t("All")}>{t("All")}</span>
        </div>
      </Item>
    );

    const _options = options.map(({ title, value, groupValue }) => (
      <Item<string> key={value} value={`${groupValue}|||${value}`}>
        <span title={title}>{title}</span>
      </Item>
    ));

    return [optionAll, ..._options];
  }

  renderTypeOptions(items: RuleListItem[]): JSX.Element {
    const { rule, onTypeChange } = this.props;
    let _value: ValueItems | undefined;

    if (isCollectionItemRule(rule) && items.length > 0) {
      _value = getValue(items, rule);
    }

    const { title: valueTitle } = _value ?? {};

    const value = valueTitle ?? ALL;

    const typeOptionsClassName = classNames("brz-ed-controls-title", {
      "brz-ed-controls-item-active": value === ALL
    });

    const optionAll = (
      <SelectItem
        className={typeOptionsClassName}
        key={ALL}
        title={t("All")}
        onClick={() => {
          onTypeChange(null);
          this.setState({
            isOpen: false
          });
        }}
      />
    );

    const newItems = items.map((item, index) =>
      isLegacyRuleListItem(item) ? (
        <LegacyRuleList
          key={index}
          item={item}
          onClick={(v) => {
            onTypeChange(v);
            this.setState({ isOpen: false });
          }}
          value={value}
        />
      ) : (
        <ListItems
          key={index}
          item={item}
          onClick={(v) => {
            onTypeChange(v);
            this.setState({ isOpen: false });
          }}
          value={value}
        />
      )
    );

    return (
      <>
        {optionAll}
        {newItems}
      </>
    );
  }

  handleSearchChange = async (
    searchTerm: string,
    currentRuleList: RuleList | null
  ): Promise<void> => {
    this.setState({
      loading: true
    });

    if (searchTerm === "" && currentRuleList) {
      this.setState({
        filteredItems: currentRuleList.items,
        loading: false
      });
      return;
    }

    if (currentRuleList && currentRuleList.items) {
      const _filteredItems = currentRuleList.items.map((item) => ({
        ...item,
        items: item.items?.filter((nestedItem) =>
          nestedItem.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }));

      const hasResults = _filteredItems.some(
        (item) => item.items && item.items.length > 0
      );

      if (hasResults) {
        this.setState({
          filteredItems: _filteredItems,
          loading: false
        });
      } else {
        try {
          const items = await this.props.getItems(
            currentRuleList.value,
            searchTerm
          );

          if (items.length === 0) {
            throw new Error(`No results found`);
          }

          const updatedRuleList2 = {
            ...currentRuleList,
            items: [
              {
                ...currentRuleList.items[0],
                items
              }
            ]
          };

          this.setState({
            filteredItems: [...updatedRuleList2.items],
            loading: false
          });
        } catch (error) {
          console.error("Search API request failed:", error);
          this.setState({
            filteredItems: _filteredItems,
            loading: false
          });
        }
      }
    } else {
      this.setState({
        loading: false
      });
    }
  };

  resetValue = () => {
    this.setState({
      isOpen: false,
      filteredItems: undefined,
      loading: false
    });

    this.props.onTypeChange(null);
  };

  render(): JSX.Element {
    const { rulesList, rule, onGroupChange } = this.props;
    const { isOpen, loading, filteredItems } = this.state;
    let groupDV: string | null = null;
    let currentRuleList: RuleList | null = null;
    let _value: MValue<ValueItems>;

    if (isCollectionItemRule(rule) || isCollectionTypeRule(rule)) {
      const currentRuleListIndex = getRulesListIndexByRule(rulesList, rule);
      currentRuleList = rulesList[currentRuleListIndex];
      groupDV = `${rule.appliedFor}|||${rule.entityType}`;
    }

    const typeOptionItems =
      filteredItems ??
      (currentRuleList && currentRuleList.items ? currentRuleList.items : []);
    const hasRulesListItems = currentRuleList && currentRuleList.items;

    if (
      isCollectionItemRule(rule) &&
      currentRuleList &&
      currentRuleList.items &&
      currentRuleList.items.length > 0
    ) {
      _value = getValue(currentRuleList.items, rule);
    }

    const { title: valueTitle, status: valueStatus } = _value ?? {};

    const selectClassName = classNames(
      "brz-ed-popup-conditions__select brz-d-xs-flex",
      "brz-ed-popup-conditions__select-condition-group",
      {
        "brz-ed-popup-conditions__select-size":
          groupDV === null || !hasRulesListItems
      }
    );

    return (
      <div className={selectClassName}>
        <Select2<string>
          size="large"
          value={groupDV ?? ALL}
          editable={false}
          autoClose={true}
          onChange={(value): void => {
            this.resetValue();
            onGroupChange(value);
          }}
          maxHeight={240}
          positionDropdown="relative"
        >
          {this.renderGroupOptions(rulesList, groupDV)}
        </Select2>
        {hasRulesListItems && (
          <ControlTypeOptions
            onClickOutside={() => this.setState({ isOpen: false })}
            onClick={() => this.setState({ isOpen: !isOpen })}
            onRemove={_value ? this.resetValue : undefined}
            status={valueStatus}
            isOpen={isOpen}
            loading={loading}
            onSearchChange={(searchTerm: string) =>
              this.handleSearchChange(searchTerm, currentRuleList)
            }
            typeOptionItems={this.renderTypeOptions(typeOptionItems)}
            value={valueTitle ?? "All"}
          />
        )}
      </div>
    );
  }
}

export default ConditionGroup;
