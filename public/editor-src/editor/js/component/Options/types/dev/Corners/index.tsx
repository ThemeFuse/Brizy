import React, { FC, useCallback, useMemo } from "react";
import { Value } from "./types/Value";
import * as V from "./types/Value";
import * as Option from "visual/component/Options/Type";
import { OptionType } from "visual/component/Options/Type";
import {
  defaultValue,
  fromElementModel,
  getIcon,
  toElementModel,
  unitSetter,
  unitTitle,
  valueSetter
} from "./utils";
import { mPipe, pipe } from "visual/utils/fp";
import { Spacing, Props as SP } from "visual/component/Controls/Spacing";
import { Edge } from "visual/component/Controls/Spacing/types";
import { Type } from "visual/component/Options/utils/Type";
import { Unit } from "./types/Unit";
import { SpacingUnit } from "visual/component/Options/utils/SpacingUnit";
import * as Positive from "visual/utils/math/Positive";
import { WithConfig } from "visual/utils/options/attributes";
import { Config } from "./types/Config";

export interface Props extends Option.Props<Value>, WithConfig<Config> {}

export const Corners: OptionType<Value> & FC<Props> = ({
  value,
  onChange,
  label,
  config
}) => {
  const onType = useCallback(
    pipe((v: Type): Value => V.setType(v, value), onChange),
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
      value,
      topLeft,
      topRight,
      bottomRight,
      bottomLeft,
      unit,
      topLeftUnit,
      topRightUnit,
      bottomRightUnit,
      bottomLeftUnit
    ]
  );

  const onValue = useCallback<SP<SpacingUnit, Edge>["onValue"]>(
    mPipe(
      (e: Edge, v: number) =>
        mPipe(Positive.fromNumber, v => valueSetter(e)(v, value))(v),
      onChange
    ),
    [onChange, value]
  );

  const onUnit = useCallback<SP<Unit, Edge>["onUnit"]>(
    pipe((e: Edge, v: Unit) => unitSetter(e)(v, value), onChange),
    [onChange, value]
  );

  const units = useMemo(
    (): SP<Unit, Edge>["units"] =>
      (config?.units ?? ["px", "%"]).map(value => ({
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

Corners.fromElementModel = fromElementModel;

Corners.toElementModel = toElementModel;

Corners.defaultValue = defaultValue;
