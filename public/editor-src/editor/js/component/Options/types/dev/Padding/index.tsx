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
  valueSetter
} from "./utils";
import { mPipe, pipe } from "visual/utils/fp";
import { Spacing, Props as SP } from "visual/component/Controls/Spacing";
import { SpacingUnit } from "visual/component/Options/utils/SpacingUnit";
import * as Positive from "visual/utils/math/Positive";
import { Edge } from "visual/component/Controls/Spacing/types";
import { Type } from "visual/component/Options/utils/Type";
import { WithConfig } from "visual/utils/options/attributes";
import { Config } from "visual/component/Options/types/dev/Padding/types/Config";

export interface Props extends Option.Props<Value>, WithConfig<Config> {}

export const Padding: OptionType<Value> & FC<Props> = ({
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
      value,
      top,
      right,
      bottom,
      left,
      unit,
      topUnit,
      rightUnit,
      bottomUnit,
      leftUnit
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

  const units = useMemo<SP<SpacingUnit, Edge>["units"]>(
    () =>
      (config?.units ?? ["px", "%"]).map(value => ({ value, title: value })),
    [config]
  );

  const onUnit = useCallback<SP<SpacingUnit, Edge>["onUnit"]>(
    pipe((e: Edge, v: SpacingUnit) => unitSetter(e)(v, value), onChange),
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

Padding.fromElementModel = fromElementModel;

Padding.toElementModel = toElementModel;

Padding.defaultValue = defaultValue;
