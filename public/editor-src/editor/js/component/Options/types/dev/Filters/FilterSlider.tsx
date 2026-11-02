import { noop } from "es-toolkit";
import React, { type ReactElement } from "react";
import { Slider } from "visual/component/Controls/Spacing/Slider";
import { MAX } from "visual/utils/options/Filters/utils";

export interface Props {
  icon: string;
  value: number;
  onChange: (n: number) => void;
  className?: string;
  title?: string;
}

const units = [{ value: "%", title: "%" }];

export const FilterSlider = ({
  icon,
  value,
  onChange,
  className,
  title
}: Props): ReactElement => {
  return (
    <Slider
      className={className}
      icon={icon}
      value={value}
      unit="%"
      onValue={onChange}
      onUnit={noop}
      units={units}
      step={1}
      min={0}
      max={MAX}
      title={title}
    />
  );
};
