import React, { ReactElement, useCallback, useMemo } from "react";
import { Props as SP, Spacing } from "visual/component/Controls/Spacing";
import { Edge } from "visual/component/Controls/Spacing/types";
import {
  Meta as OptionMeta,
  Props as OptionProps
} from "visual/component/Options/Type";
import { mPipe, pipe } from "visual/utils/fp";
import * as Positive from "visual/utils/math/Positive";
import { Meta } from "visual/utils/options/Padding/meta";
import { Config } from "visual/utils/options/Padding/types/Config";
import { Value } from "visual/utils/options/Padding/types/Value";
import * as V from "visual/utils/options/Padding/types/Value";
import {
  getIcon,
  unitSetter,
  valueSetter
} from "visual/utils/options/Padding/utils";
import { WithConfig } from "visual/utils/options/attributes";
import { SpacingUnit } from "visual/utils/options/utils/SpacingUnit";
import { Type } from "visual/utils/options/utils/Type";

export interface Props
  extends OptionProps<Value>,
    OptionMeta<Meta>,
    WithConfig<Config> {}

export const Padding = ({
  value,
  onChange,
  label,
  config
}: Props): ReactElement => {
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
    (edge: Edge, v: number, meta) =>
      mPipe(
        (e: Edge, v: number) =>
          mPipe(Positive.fromNumber, (v) => valueSetter(e)(v, value))(v),
        (v) => onChange(v, meta)
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
