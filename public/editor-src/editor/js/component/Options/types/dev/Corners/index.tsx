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
  unitSetter,
  valueSetter
} from "./utils";
import { mPipe, pipe } from "visual/utils/fp";
import { ElementValue } from "visual/component/Options/types/dev/InternalLink/types/ElementValue";
import { Spacing, Props as SP } from "visual/component/Controls/Spacing";
import { Edge } from "visual/component/Controls/Spacing/types";
import { Type } from "visual/component/Options/utils/Type";
import { Unit } from "./types/Unit";
import { SpacingUnit } from "visual/component/Options/utils/SpacingUnit";
import * as Positive from "visual/utils/math/Positive";

const toElement = (v: Value): ElementValue => toElementModel(v, identity);

export type Props = Option.Props<Value>;

export const Corners: OptionType<Value> & FC<Props> = ({
  value,
  onChange,
  label
}) => {
  const onType = useCallback(
    pipe((v: Type): Value => V.setType(v, value), toElement, onChange),
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
  const _value = useMemo<SP<Unit>["value"]>(
    () => ({
      all: corners,
      top: topLeft,
      right: topRight,
      bottom: bottomRight,
      left: bottomLeft
    }),
    [value, topLeft, topRight, bottomRight, bottomLeft]
  );

  const onValue = useCallback<SP<SpacingUnit>["onValue"]>(
    mPipe(
      (e: Edge, v: number) =>
        mPipe(Positive.fromNumber, v => valueSetter(e)(v, value))(v),
      toElement,
      onChange
    ),
    [onChange, value]
  );

  const _unit = useMemo<SP<Unit>["unit"]>(
    () => ({
      all: unit,
      top: topLeftUnit,
      right: topRightUnit,
      bottom: bottomRightUnit,
      left: bottomLeftUnit
    }),
    [unit, topLeftUnit, topRightUnit, bottomRightUnit, bottomLeftUnit]
  );

  const onUnit = useCallback<SP<Unit>["onUnit"]>(
    pipe((e: Edge, v: Unit) => unitSetter(e)(v, value), toElement, onChange),
    [onChange, value]
  );

  const units = useMemo(
    (): SP<Unit>["units"] => [
      {
        value: "px",
        title: "px"
      }
    ],
    []
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
      min={0}
      max={100}
    />
  );
};

Corners.getModel = fromElementModel;

Corners.getElementModel = toElementModel;

Corners.defaultValue = defaultValue;
