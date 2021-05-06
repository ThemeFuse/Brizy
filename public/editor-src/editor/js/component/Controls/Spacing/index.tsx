import React, { ReactElement, ReactNode, useMemo } from "react";
import classNames from "classnames";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { RadioGroup2 } from "visual/component/Controls/RadioGroup2";
import { Item } from "visual/component/Controls/RadioGroup2/Item";
import { Group } from "visual/component/Controls/Group";
import { WithClassName } from "visual/utils/options/attributes";
import { OnChange } from "visual/component/Options/Type";
import { Slider, Props as SP } from "./Slider";
import { Type, Edge, edges, types } from "./types";

export interface Props<U> extends WithClassName {
  label: ReactNode;
  type: Type;
  value: Record<Edge, number>;
  unit: Record<Edge, U>;
  units: SP<U>["units"];
  onType: OnChange<Type>;
  onValue: (edge: Edge, v: number) => void;
  onUnit: (edge: Edge, v: U) => void;
  getIcon: (edge: Exclude<Edge, "all"> | Type) => string;
  min: number;
  max: number;
  step: number;
}

type Callbacks<U> = {
  [K in Edge]: {
    onValue: (v: number) => void;
    onUnit: (v: U) => void;
  };
};

export function Spacing<U>({
  className,
  label,
  type,
  value,
  unit,
  onType,
  onValue,
  onUnit,
  units,
  getIcon,
  min,
  max,
  step
}: Props<U>): ReactElement {
  const callbacks = useMemo(
    () =>
      edges.reduce<Callbacks<U>>((acc, e) => {
        acc[e] = {
          onValue: onValue.bind(null, e),
          onUnit: onUnit.bind(null, e)
        };

        return acc;
      }, {} as Callbacks<U>),
    [onValue, onUnit]
  );

  return (
    <Group className={classNames("brz-ed-control__spacing", className)}>
      <OptionWrapper display={"inline"} className={"brz-ed-option"}>
        {label}
        <RadioGroup2<Props<U>["type"]> onChange={onType}>
          {types.map(t => (
            <Item<typeof t>
              key={t}
              icon={getIcon(t)}
              value={t}
              active={t === type}
            />
          ))}
        </RadioGroup2>
      </OptionWrapper>
      {type === "grouped" && (
        <Slider<U>
          value={value.all}
          unit={unit.all}
          onValue={callbacks.all.onValue}
          onUnit={callbacks.all.onUnit}
          units={units}
          step={step}
          min={min}
          max={max}
        />
      )}
      {type === "ungrouped" &&
        edges
          .filter((e): e is Exclude<Edge, "all"> => e !== "all")
          .map(e => (
            <Slider
              key={e}
              icon={getIcon(e)}
              value={value[e]}
              unit={unit[e]}
              onValue={callbacks[e].onValue}
              onUnit={callbacks[e].onUnit}
              units={units}
              step={step}
              min={min}
              max={max}
            />
          ))}
    </Group>
  );
}
