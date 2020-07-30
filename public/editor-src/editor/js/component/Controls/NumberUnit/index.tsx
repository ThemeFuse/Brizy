import React, { FC } from "react";
import classNames from "classnames";
import Number from "visual/component/Controls/AutoCorrectingInput";
import { Props } from "./types";

const inputWidth = (v: number): number =>
  Math.min(1, Math.max(1, String(v).length - 4)) * 24;

export const NumberUnit: FC<Props> = ({
  value: { number, unit },
  onChange,
  className,
  min = -99999,
  max = 99999,
  step,
  units
}) => {
  const onUnitChange = (u: string): void => {
    if (u !== unit) {
      onChange({ number, unit: u });
    }
  };
  const onNumberChange = (n: number): void => {
    if (n !== number) {
      onChange({ number: n, unit });
    }
  };

  return (
    <div className={classNames("brz-ed-control__number-unit", className)}>
      <div className="brz-ed-control__number-unit__input">
        <div className="brz-invisible" style={{ width: inputWidth(number) }}>
          {number}
        </div>
        <Number
          className="brz-input"
          value={number}
          onChange={onNumberChange}
          min={min}
          max={max}
          step={step}
        />
      </div>
      {units.map(({ value, title }, i) => {
        const className = classNames({
          "brz-ed-control__number-unit__unit": true,
          "brz-ed-control__number-unit__unit--active":
            units.length > 1 && value === unit
        });
        return (
          <div
            key={i}
            className={className}
            onClick={onUnitChange.bind(null, value)}
          >
            {title}
          </div>
        );
      })}
    </div>
  );
};
