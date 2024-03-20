import React, { FC, useCallback, useMemo } from "react";
import { Props as SP, Spacing } from "visual/component/Controls/Spacing";
import { Edge } from "visual/component/Controls/Spacing/types";
import * as Option from "visual/component/Options/Type";
import { SpacingUnit } from "visual/component/Options/utils/SpacingUnit";
import { Type } from "visual/component/Options/utils/Type";
import { mPipe, pipe } from "visual/utils/fp";
import * as Positive from "visual/utils/math/Positive";
import { Meta } from "visual/utils/options/Corners/meta";
import { WithConfig } from "visual/utils/options/attributes";
import { Config } from "./types/Config";
import { Unit } from "./types/Unit";
import { Value } from "./types/Value";
import * as V from "./types/Value";
import { getIcon, unitSetter, unitTitle, valueSetter } from "./utils";

export interface Props
  extends Option.Props<Value>,
    Option.Meta<Meta>,
    WithConfig<Config> {}

export const Corners: FC<Props> = ({ value, onChange, label, config }) => {
  const onType = useCallback(
    (x0: Type) => pipe((v: Type): Value => V.setType(v, value), onChange)(x0),
    [value, onChange]
  );

  const {
    value: corners,
    unit,
    topLeft,
    topLeftUnit,
    topRight,
    topRightUnit,
    bottomRight,
    bottomRightUnit,
    bottomLeft,
    bottomLeftUnit
  } = value;
  const _value = useMemo<SP<Unit, Edge>["value"]>(
    () => ({
      all: {
        number: corners,
        unit: unit
      },
      top: {
        number: topLeft,
        unit: topLeftUnit
      },
      right: {
        number: topRight,
        unit: topRightUnit
      },
      bottom: {
        number: bottomRight,
        unit: bottomRightUnit
      },
      left: {
        number: bottomLeft,
        unit: bottomLeftUnit
      }
    }),
    [
      topLeft,
      topRight,
      bottomRight,
      bottomLeft,
      unit,
      topLeftUnit,
      topRightUnit,
      bottomRightUnit,
      bottomLeftUnit,
      corners
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

  const onUnit = useCallback<SP<Unit, Edge>["onUnit"]>(
    (e: Edge, v: Unit) => onChange(unitSetter(e)(v, value)),
    [onChange, value]
  );

  const units = useMemo(
    (): SP<Unit, Edge>["units"] =>
      (config?.units ?? ["px", "%"]).map((value) => ({
        value,
        title: unitTitle(value)
      })),
    [config?.units]
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
