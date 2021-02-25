import React, { useCallback, useMemo } from "react";
import * as Option from "visual/component/Options/Type";
import { WithClassName } from "visual/utils/options/attributes";
import classNames from "classnames";
import { Value, Choice } from "./types";
import { identity } from "underscore";
import { FatIconsGrid } from "visual/component/FatIconsGrid";
import { getElementModel, getModel } from "./utils";
import { FatCheckIcon } from "visual/component/Controls/FatCheckIcon";
import { OnChange } from "visual/component/Options/Type";

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
  const _onChange = useCallback<OnChange<Value>>(
    v => onChange(getElementModel(v, identity)),
    [onChange]
  );
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
              _onChange({
                value: checked ? value.value : [...value.value, id],
                active: active ? undefined : id
              })
            }
            onCheck={(): void => {
              _onChange({
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

IconsPicker.getModel = getModel;
IconsPicker.getElementModel = getElementModel;

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
IconsPicker.defaultValue = undefined;
