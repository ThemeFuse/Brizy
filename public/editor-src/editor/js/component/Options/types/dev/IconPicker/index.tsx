import React, { useMemo } from "react";
import classNames from "classnames";
import { Props as OptionProps } from "visual/component/Options/Type";
import { WithClassName } from "visual/utils/options/attributes";
import { Value, Choice } from "./types";
import { FatIcon } from "visual/component/Controls/FatIcon";
import { FatIconsGrid } from "visual/component/FatIconsGrid";

export interface Props extends OptionProps<Value>, WithClassName {
  choices?: Choice[];
}

export const IconPicker: React.FC<Props> = ({
  className,
  choices,
  label,
  onChange,
  value
}) => {
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
    [choices]
  );

  return (
    <div className={classNames(className, "brz-ed-option__icon-picker")}>
      {label}
      <FatIconsGrid>{icons}</FatIconsGrid>
    </div>
  );
};
