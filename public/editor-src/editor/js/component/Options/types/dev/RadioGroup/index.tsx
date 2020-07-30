import React, { FC, useCallback } from "react";
import * as O from "visual/component/Options/Type";
import * as L from "visual/utils/types/Literal";
import { Literal } from "visual/utils/types/Literal";
import { SimpleValue } from "visual/component/Options/Type";
import { WithClassName } from "visual/utils/options/attributes";
import { RadioGroup2 } from "visual/component/Controls/RadioGroup2";
import { Item } from "visual/component/Controls/RadioGroup2/Item";
import { Choice } from "./Choice";

export type Props = O.Props<Literal, SimpleValue<Literal>> &
  WithClassName & {
    choices: Choice[];
  };

export const RadioGroup: FC<Props> & O.OptionType<Literal> = ({
  value,
  choices,
  onChange
}) => {
  const _onChange = useCallback(value => onChange({ value }), [
    onChange,
    value
  ]);

  return (
    <RadioGroup2 onChange={_onChange}>
      {choices.map(({ value: v, icon, title }, i) => (
        <Item
          title={title ?? ""}
          key={i}
          icon={icon}
          value={v}
          active={L.eq(v, value)}
        />
      ))}
    </RadioGroup2>
  );
};

const getModel: O.GetModel<Literal> = get => L.read(get("value")) ?? "";

RadioGroup.getModel = getModel;
