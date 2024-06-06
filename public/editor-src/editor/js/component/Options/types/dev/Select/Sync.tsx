import classnames from "classnames";
import React, { ReactElement } from "react";
import { Select2 } from "visual/component/Controls/Select2";
import {
  Item,
  Props as ItemProps
} from "visual/component/Controls/Select2/Item";
import { EditorIcon } from "visual/component/EditorIcon";
import { Literal } from "visual/utils/types/Literal";
import { ChoicesSync, Props } from "./types";
import { toElement } from "./utils";

type ItemInstance = ReactElement<ItemProps<Literal>>;

export const Sync = ({
  config,
  value: { value },
  placeholder,
  choices,
  onChange,
  className,
  iconClassName: _iconClassName
}: Omit<Props, "choices"> & {
  choices: ChoicesSync;
}): ReactElement => {
  return (
    <Select2<Literal>
      placeholder={placeholder}
      size={config?.size}
      value={value}
      className={className}
      editable={config?.search ?? false}
      autoClose={config?.autoClose ?? false}
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
            _iconClassName
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
