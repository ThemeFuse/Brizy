import React, { useMemo } from "react";
import * as Option from "visual/component/Options/Type";
import { WithClassName } from "visual/utils/options/attributes";
import classNames from "classnames";
import { Value, Choice } from "./types";
import { identity } from "underscore";
import { FatIcon } from "visual/component/Controls/FatIcon";
import { FatIconsGrid } from "visual/component/FatIconsGrid";
import { getElementModel, getModel } from "./utils";

export interface Props extends Option.Props<Value>, WithClassName {
  choices?: Choice[];
}

export const IconPicker: React.FC<Props> & Option.OptionType<Value> = ({
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
          onClick={(): void => onChange(getElementModel(id, identity))}
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

IconPicker.getModel = getModel;
IconPicker.getElementModel = getElementModel;

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
IconPicker.defaultValue = undefined;
