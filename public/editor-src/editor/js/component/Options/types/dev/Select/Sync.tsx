import classnames from "classnames";
import React, { FC, ReactElement } from "react";
import {
  Item,
  Props as ItemProps
} from "visual/component/Controls/MultiSelect/Item";
import { Select2 } from "visual/component/Controls/Select2";
import { EditorIcon } from "visual/component/EditorIcon";
import { Literal } from "visual/utils/types/Literal";
import { ChoicesSync, Props } from "./types";
import { toElement } from "./utils";

type ItemInstance = ReactElement<ItemProps<Literal>>;

export const Sync: FC<Omit<Props, "choices"> & { choices: ChoicesSync }> = ({
  config,
  value: { value },
  placeholder,
  choices,
  onChange,
  className
}) => {
  return (
    <Select2<Literal>
      placeholder={placeholder}
      size={config?.size}
      value={value}
      editable={config?.search ?? false}
      onChange={(value): void => {
        onChange(toElement(value));
      }}
    >
      {choices.map(({ title, icon, value }, i): ItemInstance => {
        let icon_;

        if (icon) {
          const iconClassName = classnames(
            "brz--space-right",
            icon.className,
            className
          );
          if (icon.name) {
            icon_ = <EditorIcon icon={icon.name} className={iconClassName} />;
          } else {
            icon_ = <div className={iconClassName} />;
          }
        }

        return (
          <Item key={i} value={value}>
            {icon_}
            {title}
          </Item>
        );
      })}
    </Select2>
  );
};
