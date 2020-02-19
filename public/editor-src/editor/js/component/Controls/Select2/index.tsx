import React, { FC } from "react";
import { last } from "underscore";
import classNames from "classnames";
import {
  MultiSelect,
  Props as MP
} from "visual/component/Controls/MultiSelect";
import { OnChange } from "visual/component/Options/Type";
import { Value, read } from "visual/component/Controls/MultiSelect/types/Value";

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
  return (
    <MultiSelect
      {...props}
      className={classNames(className, "brz-ed-control__select-single")}
      onChange={(v): void => onChange(read(last(v)) || "")}
      value={[value]}
      hideSelected={false}
    >
      {children}
    </MultiSelect>
  );
};
