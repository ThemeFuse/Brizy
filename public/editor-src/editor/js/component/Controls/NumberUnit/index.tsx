import classNames from "classnames";
import React, { ReactElement, useCallback } from "react";
import Number from "visual/component/Controls/AutoCorrectingInput";
import { Literal } from "visual/utils/types/Literal";
import { Item } from "../MultiSelect/Item";
import { Select2 } from "../Select2";
import { Props } from "./types";

const inputWidth = (v: number): number =>
  Math.min(1, Math.max(1, String(v).length - 4)) * 24;

export function NumberUnit<U extends Literal>({
  value: { number, unit },
  onChange,
  className,
  min = -99999,
  max = 99999,
  step,
  units
}: Props<U>): ReactElement {
  const onUnitChange = (u: U): void => {
    if (u !== unit) {
      onChange({ number, unit: u });
    }
  };

  const onNumberChange = (n: number): void => {
    if (n !== number) {
      onChange({ number: n, unit });
    }
  };

  const onSelectChange = useCallback(
    (v): void => {
      return onChange({ number, unit: v });
    },
    [onChange, number]
  );
  const onSelectUnitChange = useCallback(() => {
    onUnitChange(units[0].value);
  }, [onUnitChange, units]);

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
      {units.length > 1 ? (
        <Select2<U>
          className="brz-slider__select"
          editable={false}
          value={unit}
          onChange={onSelectChange}
        >
          {units.map((unit, index) => (
            <Item key={index} value={unit.value}>
              {unit.title}
            </Item>
          ))}
        </Select2>
      ) : (
        <div
          className={classNames("brz-ed-control__number-unit__unit", {
            "brz-ed-control__number-unit__unit--active":
              units.length > 1 && units[0].value === unit
          })}
          onClick={onSelectUnitChange}
        >
          {unit}
        </div>
      )}
    </div>
  );
}
