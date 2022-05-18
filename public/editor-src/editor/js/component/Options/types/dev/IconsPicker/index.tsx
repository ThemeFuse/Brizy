import React, { useMemo } from "react";
import * as Option from "visual/component/Options/Type";
import { WithClassName } from "visual/utils/options/attributes";
import classNames from "classnames";
import { Value, Choice } from "./types";
import { FatIconsGrid } from "visual/component/FatIconsGrid";
import { getElementModel, getModel } from "./utils";
import { FatCheckIcon } from "visual/component/Controls/FatCheckIcon";

export interface Props extends Option.Props<Value>, WithClassName {
  choices?: Choice[];
}

export const IconsPicker: React.FC<Props> & Option.OptionType<Value> = ({
  className,
  choices,
  label,
  onChange,
  value
}) => {
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
                  ? value.value.filter(i => i !== id)
                  : [...value.value, id],
                active: checked ? undefined : value.active
              });
            }}
          />
        );
      }),
    [choices, value]
  );

  return (
    <div className={classNames(className, "brz-ed-option__icon-picker")}>
      {label}
      <FatIconsGrid>{icons}</FatIconsGrid>
    </div>
  );
};

IconsPicker.fromElementModel = getModel;
IconsPicker.toElementModel = getElementModel;

// @ts-expect-error: Type 'undefined' is not assignable to type 'Value'.
IconsPicker.defaultValue = undefined;
