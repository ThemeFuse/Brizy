import FuzzySearch from "fuzzy-search";
import React, { FC, useEffect, useState } from "react";
import { uniq, initial } from "underscore";
import { WithClassName } from "visual/utils/options/attributes";
import { OnChange } from "visual/component/Options/Type";
import { Item } from "./Item";
import { Tag } from "./Tag";
import { apply, arrowFn, getValue, orderBy } from "./utils";
import { Component } from "./Component";
import { ItemInstance, ItemProps } from "./types/Item";

type Items = Array<ItemInstance>;
type ItemValue = ItemProps["value"];
type ItemsPromise = (v?: ItemProps["value"]) => Promise<ItemInstance[]>;

export type Props = WithClassName & {
  placeholder?: string;
  children: ItemInstance[] | ItemsPromise;
  value: ItemValue[];
  onChange: OnChange<Array<ItemProps["value"]>>;
  editable?: boolean;
  size?: "short" | "medium" | "large" | "full" | "auto";
  scroll?: number;
  hideSelected?: boolean;
};

export const MultiSelect: FC<Props> = ({
  className,
  value,
  children,
  onChange,
  scroll,
  editable = true,
  size = "medium",
  placeholder = "",
  hideSelected = true
}) => {
  const [items, setItems] = useState<ItemInstance[]>([]);
  const [filtered, setFiltered] = useState<ItemInstance[]>([]);
  const [active, setActive] = useState<ItemValue | undefined>();
  const [inputValue, setInputValue] = useState("");
  const isActive = (i: ItemValue): boolean => active === i || value.includes(i);

  const filterByInput = (items: ItemInstance[]): void => {
    const searcher = new FuzzySearch(items as Items, ["props.children"]);
    setFiltered(
      searcher
        .search(inputValue)
        .filter(i => !(hideSelected && value.includes(getValue(i))))
    );
  };

  useEffect(() => setActive(undefined), [filtered]);
  useEffect(() => apply(setItems, children), [children]);
  useEffect(() => apply(filterByInput, children, inputValue), [
    children,
    inputValue,
    value
  ]);

  const onSelect = (i: ItemInstance): void => {
    onChange(uniq([...value, getValue(i)]));
  };
  const onKeyDown: OnChange<string> = key => {
    switch (key) {
      case "Backspace":
        if (!inputValue.length && value.length) {
          onChange(initial(value));
        }
        break;
      case "Enter":
        if (active) {
          onChange(uniq([...value, active]));
          setInputValue("");
        }
        break;
      case "ArrowDown":
      case "ArrowUp":
        if (filtered.length) {
          const fn = arrowFn(key);
          const v = active
            ? fn<ItemValue>(active, filtered.map(getValue))
            : getValue(filtered[0]);
          setActive(v);
        }
        break;
    }
  };
  const onRemove: OnChange<ItemValue> = v => {
    onChange(value.filter(i => i !== v));
  };

  // Filter values by children and not vice-versa,
  // in order to show items by the order they were selected
  const tags = orderBy(value, items).map(
    (item, i) => (
      <Tag key={i} onRemove={(): void => onRemove(getValue(item))}>
        {item.props.children}
      </Tag>
    ),
    []
  );

  return (
    <Component
      className={className}
      placeholder={placeholder}
      size={size}
      inputValue={inputValue}
      tags={tags}
      editable={editable}
      onSelect={onSelect}
      onKeyDown={onKeyDown}
      onType={setInputValue}
      scroll={scroll}
    >
      {filtered.map(({ props }) => (
        <Item {...props} key={props.value} active={isActive(props.value)} />
      ))}
    </Component>
  );
};
