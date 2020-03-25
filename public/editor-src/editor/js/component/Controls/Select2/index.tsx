import React, { FC, useState } from "react";
import { last } from "underscore";
import classNames from "classnames";
import {
  MultiSelect,
  Props as MP
} from "visual/component/Controls/MultiSelect";
import { OnChange } from "visual/component/Options/Type";
import { Value, read } from "visual/component/Controls/MultiSelect/types/Value";
import { apply } from "visual/component/Options/types/dev/MultiSelect/utils";

type Props = Omit<Omit<MP, "onChange">, "value"> & {
  onChange: OnChange<Value>;
  value: Value;
};

export const Select2: FC<Props> = ({
  value,
  onChange,
  children,
  className,
  ...props
}) => {
  const [_value, setValue] = useState(value);

  return (
    <MultiSelect
      {...props}
      className={classNames(className, "brz-ed-control__select-single")}
      onChange={(v): void => onChange(read(last(v)) || "")}
      value={[_value]}
      hideSelected={false}
    >
      {apply(items => {
        const v =
          items.find(i => i.props.value === value)?.props.value ??
          items[0]?.props.value ??
          "";
        if (_value !== v) {
          setValue(v);
        }

        return items;
      }, children)}
    </MultiSelect>
  );
};
