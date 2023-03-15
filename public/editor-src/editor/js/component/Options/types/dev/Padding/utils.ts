import * as Positive from "visual/utils/math/Positive";
import * as Unit from "visual/component/Options/utils/SpacingUnit";
import {
  setBottom,
  setBottomUnit,
  setLeft,
  setLeftUnit,
  setValue,
  setRight,
  setRightUnit,
  setTop,
  setTopUnit,
  setUnit,
  Value
} from "./types/Value";
import { readWithParser } from "visual/utils/reader/readWithParser";
import { mPipe } from "visual/utils/fp";
import { Value as NV } from "visual/component/Controls/NumberUnit/types";
import { prop } from "visual/utils/object/get";
import { Edge } from "visual/component/Controls/Spacing/types";
import { Setter } from "visual/utils/model";
import * as Margin from "visual/component/Options/types/dev/Margin/utils";

export const fromNumberSlider = readWithParser<
  NV<Unit.SpacingUnit>,
  { number: Positive.Positive; unit: Unit.SpacingUnit }
>({
  number: mPipe(prop("number"), Positive.fromNumber),
  unit: v => v.unit
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
