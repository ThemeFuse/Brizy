import React, { ReactElement, FC } from "react";
import { Select2 } from "visual/component/Controls/Select2";
import {
  Item,
  Props as ItemProps
} from "visual/component/Controls/MultiSelect/Item";
import { EditorIcon } from "visual/component/EditorIcon";
import { Literal } from "visual/utils/types/Literal";
import { toElement } from "./utils";
import { ChoicesSync, Props } from "./types";

type ItemInstance = ReactElement<ItemProps<Literal>>;

export const Sync: FC<Omit<Props, "choices"> & { choices: ChoicesSync }> = ({
  config,
  value: { value },
  placeholder,
  choices,
  onChange
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
      {choices.map(
        ({ title, icon, value }, i): ItemInstance => (
          <Item key={i} value={value}>
            {icon && <EditorIcon icon={icon} className={"brz--space-right"} />}
            {title}
          </Item>
        )
      )}
    </Select2>
  );
};
