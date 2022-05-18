import React, { FC, useCallback } from "react";
import * as O from "visual/component/Options/Type";
import * as L from "visual/utils/types/Literal";
import { Literal } from "visual/utils/types/Literal";
import { SimpleValue } from "visual/component/Options/Type";
import { WithClassName } from "visual/utils/options/attributes";
import { RadioGroup2 } from "visual/component/Controls/RadioGroup2";
import { Item } from "visual/component/Controls/RadioGroup2/Item";
import { Choice } from "./Choice";

export type Props = O.Props<SimpleValue<Literal>> &
  WithClassName & {
    choices: Choice[];
  };

export const RadioGroup: FC<Props> & O.OptionType<SimpleValue<Literal>> = ({
  value: { value },
  choices,
  onChange,
  label
}) => {
  const _onChange = useCallback(value => onChange({ value }), [
    onChange,
    value
  ]);

  return (
    <>
      {label}
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
    </>
  );
};

const getModel: O.FromElementModel<SimpleValue<Literal>> = get => ({
  value: L.read(get("value"))
});

const getElementModel: O.ToElementModel<SimpleValue<Literal>> = values => {
  return {
    value: values.value
  };
};

RadioGroup.fromElementModel = getModel;

RadioGroup.toElementModel = getElementModel;

RadioGroup.defaultValue = { value: "" };
