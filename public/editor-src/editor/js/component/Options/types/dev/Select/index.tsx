import React, { FC, ReactElement, useCallback } from "react";
import { Select2 } from "visual/component/Controls/Select2";
import {
  Item,
  Props as ItemProps
} from "visual/component/Controls/MultiSelect/Item";
import EditorIcon from "visual/component/EditorIcon";
import {
  GetModel,
  OnChange,
  OptionType,
  SimpleValue
} from "visual/component/Options/Type";
import { Literal, read } from "visual/utils/types/Literal";
import { mCompose } from "visual/utils/value";
import { Props as P } from "visual/component/Options/types/dev/MultiSelect/types";

const wrap = (value: Literal): SimpleValue<Literal> => ({ value });

type ItemInstance = ReactElement<ItemProps<Literal>>;
export type Props = Exclude<P, "value" | "onChange"> & {
  value: Literal;
  onChange: OnChange<SimpleValue<Literal>>;
};

export const Select: FC<Props> & OptionType<Literal> = ({
  onChange,
  config,
  value,
  placeholder,
  choices
}) => {
  const _onChange = useCallback(mCompose(onChange, wrap), [onChange, choices]);
  return (
    <Select2<Literal>
      onChange={_onChange}
      placeholder={placeholder}
      size={config?.size}
      value={value}
      editable={config?.search ?? false}
      search={(s: string, v: Literal): boolean =>
        !!choices
          .filter(({ value }) => value == v)
          .filter(({ title }) => title.includes(s)).length
      }
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

const getModel: GetModel<Literal> = get => read(get("value")) || "";

Select.getModel = getModel;
