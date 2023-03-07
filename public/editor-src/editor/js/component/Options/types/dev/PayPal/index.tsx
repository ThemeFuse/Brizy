import { pass } from "fp-utilities";
import React, { ReactElement, useCallback, useState } from "react";
import { PayPal as Control } from "visual/component/Controls/PayPal";
import { Props as OptionProps } from "visual/component/Options/Type";
import { always, pipe } from "visual/utils/fp";
import { is } from "visual/utils/string/NoEmptyString";
import { Model } from "./Type";

export type Props = OptionProps<Model>;

export const PayPal = ({ onChange, value, label }: Props): ReactElement => {
  const [v, setV] = useState<string>(value.value ?? "");
  const handleOnChange = useCallback(
    pipe(
      always(v),
      pass(is),
      (value) => onChange({ value }),
      () => Promise.resolve()
    ),
    [onChange, v]
  );
  const handleCancel = useCallback(
    pipe(
      () => setV(value.value ?? ""),
      () => Promise.resolve()
    ),
    [value.value]
  );

  return (
    <Control
      label={label}
      value={v}
      onChange={setV}
      onSave={handleOnChange}
      onCancel={handleCancel}
    />
  );
};
