import classNames from "classnames";
import React, { useMemo } from "react";
import { FatIcon } from "visual/component/Controls/FatIcon";
import { FatIconsGrid } from "visual/component/FatIconsGrid";
import { Props as OptionProps } from "visual/component/Options/Type";
import { WithClassName } from "visual/utils/options/attributes";
import { Choice, Value } from "./types";

export interface Props extends OptionProps<Value>, WithClassName {
  choices?: Choice[];
}

export const IconPicker = ({
  className,
  choices,
  label,
  onChange,
  value
}: Props): JSX.Element => {
  const icons = useMemo(
    () =>
      choices?.map(({ icon, title, value: id }) => (
        <FatIcon
          key={id}
          icon={icon}
          label={title}
          active={id === value}
          onClick={(): void => onChange(id)}
        />
      )),
    [choices, onChange, value]
  );

  return (
    <div className={classNames(className, "brz-ed-option__icon-picker")}>
      {label}
      <FatIconsGrid>{icons}</FatIconsGrid>
    </div>
  );
};
