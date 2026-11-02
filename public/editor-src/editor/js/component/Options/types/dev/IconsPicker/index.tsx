import classNames from "classnames";
import React, { useMemo } from "react";
import { FatCheckIcon } from "visual/component/Controls/FatCheckIcon";
import { FatIconsGrid } from "visual/component/FatIconsGrid";
import type { Props as OptionProps } from "visual/component/Options/Type";
import type { WithClassName } from "visual/types/attributes";
import type { Choice, Value } from "./types";

export interface Props extends OptionProps<Value>, WithClassName {
  choices?: Choice[];
}

export const IconsPicker = ({
  className,
  choices,
  label,
  onChange,
  value
}: Props): JSX.Element => {
  const icons = useMemo(
    () =>
      choices?.map(({ icon, title, value: id }) => {
        const active = value.active === id;
        const checked = value.value.includes(id);

        return (
          <FatCheckIcon
            key={id}
            icon={icon}
            label={title}
            active={active}
            checked={checked}
            onClick={(): void =>
              onChange({
                value: checked ? value.value : [...value.value, id],
                active: active ? undefined : id
              })
            }
            onCheck={(): void => {
              onChange({
                value: checked
                  ? value.value.filter((i) => i !== id)
                  : [...value.value, id],
                active: checked ? undefined : value.active
              });
            }}
          />
        );
      }),
    [choices, value, onChange]
  );

  return (
    <div className={classNames(className, "brz-ed-option__icon-picker")}>
      {label}
      <FatIconsGrid>{icons}</FatIconsGrid>
    </div>
  );
};
