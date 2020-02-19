import React, { FC } from "react";
import { take } from "underscore";
import EditorIcon from "visual/component/EditorIcon";
import { MultiSelect as Control } from "visual/component/Controls/MultiSelect";
import { OptionType } from "visual/component/Options/Type";
import { Item } from "visual/component/Controls/MultiSelect/Item";
import { apply, getModel } from "./utils";
import { Props } from "./types";
import { Value } from "./Value";

export const MultiSelect: FC<Props> & OptionType<Value[]> = ({
  placeholder,
  choices,
  value = [],
  onChange,
  config
}) => {
  return (
    <Control
      placeholder={placeholder}
      size={config?.size ?? "medium"}
      value={value}
      editable={config?.search ?? true}
      onChange={(v): void => {
        const n = config?.items || 999;
        onChange({ value: JSON.stringify(take(v, n)) });
      }}
    >
      {apply(
        items =>
          items.map(({ value, title, icon }, i) => (
            <Item key={i} value={value}>
              {icon && (
                <EditorIcon icon={icon} className={"brz--space-right"} />
              )}
              {title}
            </Item>
          )),
        choices ?? []
      )}
    </Control>
  );
};

MultiSelect.getModel = getModel;
