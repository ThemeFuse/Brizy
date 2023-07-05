import React, { FC, useCallback, useMemo } from "react";
import { Props as SP, Spacing } from "visual/component/Controls/Spacing";
import { Edge } from "visual/component/Controls/Spacing/types";
import { Props as OptionProps } from "visual/component/Options/Type";
import { Config } from "visual/component/Options/types/dev/Padding/types/Config";
import { SpacingUnit } from "visual/component/Options/utils/SpacingUnit";
import { Type } from "visual/component/Options/utils/Type";
import { mPipe, pipe } from "visual/utils/fp";
import * as Positive from "visual/utils/math/Positive";
import { WithConfig } from "visual/utils/options/attributes";
import { Value } from "./types/Value";
import * as V from "./types/Value";
import { getIcon, unitSetter, valueSetter } from "./utils";

export interface Props extends OptionProps<Value>, WithConfig<Config> {}

export const Padding: FC<Props> = ({ value, onChange, label, config }) => {
  const onType = useCallback(
    (v: Type) => onChange(V.setType(v, value)),
    [value, onChange]
  );

  const {
    value: padding,
    unit,
    top,
    topUnit,
    right,
    rightUnit,
    bottom,
    bottomUnit,
    left,
    leftUnit
  } = value;
  const _value = useMemo<SP<SpacingUnit, Edge>["value"]>(
    () => ({
      all: {
        number: padding,
        unit: unit
      },
      top: {
        number: top,
        unit: topUnit
      },
      right: {
        number: right,
        unit: rightUnit
      },
      bottom: {
        number: bottom,
        unit: bottomUnit
      },
      left: {
        number: left,
        unit: leftUnit
      }
    }),
    [
      top,
      right,
      bottom,
      left,
      unit,
      topUnit,
      rightUnit,
      bottomUnit,
      leftUnit,
      padding
    ]
  );

  const onValue = useCallback<SP<SpacingUnit, Edge>["onValue"]>(
    (edge: Edge, v: number) =>
      mPipe(
        (e: Edge, v: number) =>
          mPipe(Positive.fromNumber, (v) => valueSetter(e)(v, value))(v),
        onChange
      )(edge, v),
    [onChange, value]
  );

  const units = useMemo<SP<SpacingUnit, Edge>["units"]>(
    () =>
      (config?.units ?? ["px", "%"]).map((value) => ({ value, title: value })),
    [config]
  );

  const onUnit = useCallback<SP<SpacingUnit, Edge>["onUnit"]>(
    (edge: Edge, v: SpacingUnit) =>
      pipe((e: Edge, v: SpacingUnit) => unitSetter(e)(v, value), onChange)(
        edge,
        v
      ),
    [onChange, value]
  );

  return (
    <Spacing
      label={label}
      type={value.type}
      value={_value}
      units={units}
      onType={onType}
      onValue={onValue}
      onUnit={onUnit}
      getIcon={getIcon}
      step={1}
      min={0}
      max={100}
    />
  );
};
