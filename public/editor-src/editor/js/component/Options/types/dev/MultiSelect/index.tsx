import React, { FC } from "react";
import { take } from "underscore";
import EditorIcon from "visual/component/EditorIcon";
import { MultiSelect as Control } from "visual/component/Controls/MultiSelect";
import { OptionType } from "visual/component/Options/Type";
import { Item } from "visual/component/Controls/MultiSelect/Item";
import { getModel, toElement } from "./utils";
import { Props } from "./types";
import { Value } from "./Value";

export const MultiSelect: FC<Props> & OptionType<Value[]> = ({
  placeholder,
  choices,
  value = [],
  onChange,
  config
}) => {
  const items = choices ?? [];
  return (
    <Control<Value>
      placeholder={placeholder}
      size={config?.size ?? "medium"}
      value={value}
      editable={config?.search ?? true}
      onChange={(v): void => {
        const n = config?.items || 999;
        onChange(toElement(take(v, n)));
      }}
      search={(s, v): boolean => String(v).includes(s)}
    >
      {items.map(({ title, icon, value }, i) => (
        <Item<Value> value={value} key={i}>
          {icon && <EditorIcon icon={icon} className={"brz--space-right"} />}
          {title}
        </Item>
      ))}
    </Control>
  );
};

MultiSelect.getModel = getModel;
