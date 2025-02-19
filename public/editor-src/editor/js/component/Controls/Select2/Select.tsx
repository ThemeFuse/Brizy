import { initial, uniq } from "es-toolkit";
import React, { KeyboardEvent, ReactElement, useEffect, useState } from "react";
import { OnChange } from "visual/component/Options/Type";
import { WithClassName, WithSize } from "visual/types/attributes";
import { Position } from "visual/utils/position/Position";
import { Literal } from "visual/utils/types/Literal";
import { Component } from "./Component";
import { Props as ItemProps } from "./Item";
import { SelectItem } from "./SelectItem";
import { Tag } from "./Tag";
import { arrowFn } from "./utils";

export type ItemType<T> = ReactElement<ItemProps<T>>;

export type Props<T extends Literal> = WithClassName &
  WithSize & {
    placeholder?: string;
    children: ItemType<T>[];
    value: T[];
    onChange: OnChange<T[]>;
    editable?: boolean;
    inputValue?: string;
    onInputChange?: (v: string) => void;
    scroll?: number;
    hideSelected?: boolean;
    autoClose?: boolean;
    onOpen?: () => void;
    maxHeight?: number;
    positionDropdown?: Position;
  };

export function Select<T extends Literal>({
  className,
  value,
  children,
  onChange,
  scroll,
  editable = true,
  size = "medium",
  placeholder = "",
  hideSelected = true,
  autoClose,
  onOpen,
  inputValue,
  onInputChange,
  positionDropdown,
  maxHeight
}: Props<T>): ReactElement {
  const [active, setActive] = useState<T | undefined>();
  const isActive = (i: T): boolean => active === i || value.includes(i);

  useEffect(() => {
    if (active !== undefined) {
      setActive(undefined);
    }
  }, [children, active]);

  const onRemove: OnChange<T> = (v) => {
    onChange(value.filter((i) => i !== v));
  };
  const tags = value.reduce((acc, v) => {
    const item = children.find((c) => c.props.value === v);

    if (item !== undefined) {
      acc.push(
        <Tag
          key={item.props.value}
          onRemove={(): void => onRemove(item.props.value)}
        >
          {item.props.children}
        </Tag>
      );
    }

    return acc;
  }, [] as ReactElement[]);

  // if no default value found add first children
  if (tags.length === 0 && children.length) {
    const [first] = children;
    tags.push(
      <Tag
        key={first.props.value}
        onRemove={(): void => onRemove(first.props.value)}
      >
        {first.props.children}
      </Tag>
    );
  }

  const nonSelectedChildren = children.filter(
    ({ props }) => !(hideSelected && value.includes(props.value))
  );

  const onSelect = (i: T): void => {
    onChange(uniq([...value, i]));
    onInputChange?.("");
  };
  const onKeyDown: OnChange<KeyboardEvent> = (e) => {
    const key = e.key;
    switch (key) {
      case "ArrowDown":
      case "ArrowUp": {
        const filtered = nonSelectedChildren.filter((i) => !i.props.disabled);

        if (filtered.length > 0) {
          const nextActive =
            active !== undefined
              ? arrowFn(key)(
                  active,
                  filtered.map((i) => i.props.value)
                )
              : filtered[0].props.value;
          setActive(nextActive);
          e.preventDefault();
        }
        break;
      }
      case "Enter":
        if (active !== undefined) {
          onChange(uniq([...value, active]));
          onInputChange?.("");
        }
        break;
      case "Backspace":
        if (!inputValue?.length && value.length) {
          onChange(initial(value));
        }
        break;
    }
  };

  return (
    <Component
      className={className}
      placeholder={placeholder}
      size={size}
      inputValue={inputValue}
      tags={tags}
      editable={editable}
      scroll={scroll}
      autoClose={autoClose}
      onSelect={onSelect}
      onKeyDown={onKeyDown}
      onType={onInputChange}
      onOpen={onOpen}
      maxHeight={maxHeight}
      positionDropdown={positionDropdown}
    >
      {nonSelectedChildren.map(({ props }) => (
        <SelectItem
          {...props}
          active={isActive(props.value)}
          key={props.value}
        />
      ))}
    </Component>
  );
}
