import React, { type ReactElement, useCallback } from "react";
import {
  RadioGroup2,
  type Props as RadioGroup2Props
} from "visual/component/Controls/RadioGroup2";
import { Item } from "visual/component/Controls/RadioGroup2/Item";
import type {
  Props as OptionProps,
  SimpleValue
} from "visual/component/Options/Type";
import type { WithClassName } from "visual/types/attributes";
import type { Literal } from "visual/utils/types/Literal";
import * as L from "visual/utils/types/Literal";
import type { Choice } from "./Choice";

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
        {choices.map(({ value: v, icon, title }) => (
          <Item
            title={title ?? ""}
            key={v}
            icon={icon}
            value={v}
            active={L.eq(v, value)}
          />
        ))}
      </RadioGroup2>
    </>
  );
};
