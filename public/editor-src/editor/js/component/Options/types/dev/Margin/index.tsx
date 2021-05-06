import React, { FC, useCallback, useMemo } from "react";
import { identity } from "underscore";
import { Value } from "./types/Value";
import * as V from "./types/Value";
import * as Option from "visual/component/Options/Type";
import { OptionType } from "visual/component/Options/Type";
import {
  defaultValue,
  fromElementModel,
  getIcon,
  toElementModel,
  units,
  unitSetter,
  valueSetter
} from "./utils";
import { pipe } from "visual/utils/fp";
import { ElementValue } from "visual/component/Options/types/dev/InternalLink/types/ElementValue";
import { Spacing, Props as SP } from "visual/component/Controls/Spacing";
import { SpacingUnit } from "visual/component/Options/utils/SpacingUnit";
import { Edge } from "visual/component/Controls/Spacing/types";
import { Type } from "visual/component/Options/utils/Type";

const toElement = (v: Value): ElementValue => toElementModel(v, identity);

export type Props = Option.Props<Value>;

export const Margin: OptionType<Value> & FC<Props> = ({
  value,
  onChange,
  label
}) => {
  const onType = useCallback(
    pipe((v: Type): Value => V.setType(v, value), toElement, onChange),
    [value, onChange]
  );

  const {
    value: margin,
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
  const _value = useMemo<SP<SpacingUnit>["value"]>(
    () => ({
      all: margin,
      top: top,
      right: right,
      bottom: bottom,
      left: left
    }),
    [value, top, right, bottom, left]
  );

  const onValue = useCallback<SP<SpacingUnit>["onValue"]>(
    pipe((e: Edge, v: number) => valueSetter(e)(v, value), toElement, onChange),
    [onChange, value]
  );

  const _unit = useMemo<SP<SpacingUnit>["unit"]>(
    () => ({
      all: unit,
      top: topUnit,
      right: rightUnit,
      bottom: bottomUnit,
      left: leftUnit
    }),
    [unit, topUnit, rightUnit, bottomUnit, leftUnit]
  );

  const onUnit = useCallback<SP<SpacingUnit>["onUnit"]>(
    pipe(
      (e: Edge, v: SpacingUnit) => unitSetter(e)(v, value),
      toElement,
      onChange
    ),
    [onChange, value]
  );

  return (
    <Spacing
      label={label}
      type={value.type}
      value={_value}
      unit={_unit}
      units={units}
      onType={onType}
      onValue={onValue}
      onUnit={onUnit}
      getIcon={getIcon}
      step={1}
      min={-100}
      max={100}
    />
  );
};

Margin.getModel = fromElementModel;

Margin.getElementModel = toElementModel;

Margin.defaultValue = defaultValue;
