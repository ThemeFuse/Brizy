import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { uniq, initial, sortBy } from "underscore";
import { WithClassName, WithSize } from "visual/utils/options/attributes";
import { OnChange } from "visual/component/Options/Type";
import { Tag } from "./Tag";
import { apply, arrowFn } from "./utils";
import { Component } from "./Component";
import { SelectItem } from "./SelectItem";
import { Props as ItemProps } from "./Item";
import { Literal } from "visual/utils/types/Literal";

type ItemType<T> = ReactElement<ItemProps<T>>;

export type Props<T extends Literal> = WithClassName &
  WithSize & {
    placeholder?: string;
    children: ItemType<T>[];
    value: T[];
    onChange: OnChange<T[]>;
    editable?: boolean;
    scroll?: number;
    hideSelected?: boolean;
    search: (s: string, t: T) => boolean;
    onOpen?: () => void;
  };

export function MultiSelect<T extends Literal>({
  className,
  value,
  children,
  onChange,
  scroll,
  editable = true,
  size = "medium",
  placeholder = "",
  hideSelected = true,
  search,
  onOpen
}: Props<T>): ReactElement {
  const [filtered, setFiltered] = useState<ItemType<T>[]>([]);
  const [active, setActive] = useState<T | undefined>();
  const [inputValue, setInputValue] = useState("");
  const isActive = (i: T): boolean => active === i || value.includes(i);

  const filterByInput = (items: ItemType<T>[]): void => {
    setFiltered(
      items
        .filter(({ props: { value } }) => search(inputValue, value))
        .filter(({ props }) => !(hideSelected && value.includes(props.value)))
    );
  };

  useEffect(() => setActive(undefined), [filtered]);
  useEffect(() => apply(filterByInput, children), [
    children,
    inputValue,
    value
  ]);

  const onSelect = useCallback(
    (i): void => {
      onChange(uniq([...value, i]));
    },
    [value]
  );
  const onKeyDown: OnChange<string> = key => {
    switch (key) {
      case "Backspace":
        if (!inputValue.length && value.length) {
          onChange(initial(value));
        }
        break;
      case "Enter":
        if (active !== undefined) {
          onChange(uniq([...value, active]));
          setInputValue("");
        }
        break;
      case "ArrowDown":
      case "ArrowUp":
        if (filtered.length) {
          const fn = arrowFn(key);
          const v =
            active !== undefined
              ? fn(
                  active,
                  filtered.map(({ props: { value } }) => value)
                )
              : filtered[0].props.value;
          setActive(v);
        }
        break;
    }
  };
  const onRemove: OnChange<T> = v => {
    onChange(value.filter(i => i !== v));
  };

  // Filter values by children and not vice-versa,
  // in order to show items by the order they were selected
  const tags = sortBy(
    children.filter(c => value.includes(c.props.value)),
    ({ props }) => value.findIndex(v => v === props.value)
  ).map(
    (item, i) => (
      <Tag key={i} onRemove={(): void => onRemove(item.props.value)}>
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
      onOpen={onOpen}
    >
      {filtered.map(({ props }, i) => (
        <SelectItem {...props} key={i} active={isActive(props.value)} />
      ))}
    </Component>
  );
}
