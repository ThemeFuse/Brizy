import React, { ReactElement, useCallback } from "react";
import {
  RadioGroup2,
  Props as RadioGroup2Props
} from "visual/component/Controls/RadioGroup2";
import { Item } from "visual/component/Controls/RadioGroup2/Item";
import { Props as OptionProps } from "visual/component/Options/Type";
import { SimpleValue } from "visual/component/Options/Type";
import { WithClassName } from "visual/utils/options/attributes";
import * as L from "visual/utils/types/Literal";
import { Literal } from "visual/utils/types/Literal";
import { Choice } from "./Choice";

export type Props = OptionProps<SimpleValue<Literal>> &
  WithClassName & {
    choices: Choice[];
  };

export const RadioGroup = ({
  value: { value },
  choices,
  onChange,
  label
}: Props): ReactElement => {
  const _onChange = useCallback<RadioGroup2Props<Literal>["onChange"]>(
    (value) => onChange({ value }),
    [onChange]
  );

  return (
    <>
      {label}
      <RadioGroup2<Literal> onChange={_onChange}>
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
