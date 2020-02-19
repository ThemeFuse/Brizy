import React, { FC } from "react";
import { Select2 } from "visual/component/Controls/Select2";
import { apply } from "visual/component/Options/types/dev/MultiSelect/utils";
import { Item } from "visual/component/Controls/MultiSelect/Item";
import { Props } from "./types";
import { GetModel, OptionType } from "visual/component/Options/Type";
import { ItemInstance } from "visual/component/Controls/MultiSelect/types/Item";
import { Literal, read } from "visual/utils/types/Literal";
import EditorIcon from "visual/component/EditorIcon";

export const Select: FC<Props> & OptionType<Literal> = ({
  onChange,
  config,
  value,
  placeholder,
  choices
}) => {
  return (
    <Select2
      onChange={(v): void => onChange({ value: v })}
      placeholder={placeholder}
      size={config?.size}
      value={value}
      editable={config?.search ?? false}
    >
      {apply(
        items =>
          items.map(
            ({ value, title, icon }, i): ItemInstance => (
              <Item key={i} value={value}>
                {icon && (
                  <EditorIcon icon={icon} className={"brz--space-right"} />
                )}
                {title}
              </Item>
            )
          ),
        choices
      )}
    </Select2>
  );
};

const getModel: GetModel<Literal> = get => read(get("value")) || "";

Select.getModel = getModel;
