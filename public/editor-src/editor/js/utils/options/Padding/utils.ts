import type { Value as NV } from "visual/component/Controls/NumberUnit/types";
import type { Edge } from "visual/component/Controls/Spacing/types";
import { mPipe } from "visual/utils/fp";
import * as Positive from "visual/utils/math/Positive";
import type { Setter } from "visual/utils/model";
import { prop } from "visual/utils/object/get";
import * as Margin from "visual/utils/options/Margin/utils";
import type * as Unit from "visual/utils/options/utils/SpacingUnit";
import { readWithParser } from "visual/utils/reader/readWithParser";
import {
  setBottom,
  setBottomUnit,
  setLeft,
  setLeftUnit,
  setRight,
  setRightUnit,
  setTop,
  setTopUnit,
  setUnit,
  setValue,
  type Value
} from "./types/Value";

export const fromNumberSlider = readWithParser<
  NV<Unit.SpacingUnit>,
  { number: Positive.Positive; unit: Unit.SpacingUnit }
>({
  number: mPipe(prop("number"), Positive.fromNumber),
  unit: (v) => v.unit
});

export const getIcon = Margin.getIcon;

export const valueSetter = (e: Edge): Setter<Positive.Positive, Value> => {
  switch (e) {
    case "all":
      return setValue;
    case "top":
      return setTop;
    case "right":
      return setRight;
    case "bottom":
      return setBottom;
    case "left":
      return setLeft;
  }
};

export const unitSetter = (e: Edge): Setter<Unit.SpacingUnit, Value> => {
  switch (e) {
    case "all":
      return setUnit;
    case "top":
      return setTopUnit;
    case "right":
      return setRightUnit;
    case "bottom":
      return setBottomUnit;
    case "left":
      return setLeftUnit;
  }
};
