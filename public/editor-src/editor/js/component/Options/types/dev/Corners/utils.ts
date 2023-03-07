import * as Positive from "visual/utils/math/Positive";
import * as Unit from "./types/Unit";
import {
  setBottomRight,
  setBottomRightUnit,
  setBottomLeft,
  setBottomLeftUnit,
  setValue,
  setTopRight,
  setTopRightUnit,
  setTopLeft,
  setTopLeftUnit,
  setUnit,
  Value
} from "./types/Value";
import { readWithParser } from "visual/utils/reader/readWithParser";
import { Value as NV } from "visual/component/Controls/NumberUnit/types";
import { Props as SP } from "visual/component/Controls/Spacing";
import { Edge } from "visual/component/Controls/Spacing/types";
import { Setter } from "visual/utils/model";

export const fromNumberSlider = readWithParser<
  NV<Unit.Unit>,
  { number: number; unit: Unit.Unit }
>({
  number: v => v.number,
  unit: v => v.unit
});

export const getIcon: SP<Unit.Unit, Edge>["getIcon"] = e => {
  switch (e) {
    case "grouped":
      return "nc-corners-all";
    case "ungrouped":
      return "nc-corners-individual";
    case "top":
      return "nc-corners-top-left";
    case "right":
      return "nc-corners-top-right";
    case "bottom":
      return "nc-corners-bottom-right";
    case "left":
      return "nc-corners-bottom-left";
  }
};

export const valueSetter = (e: Edge): Setter<Positive.Positive, Value> => {
  switch (e) {
    case "all":
      return setValue;
    case "top":
      return setTopLeft;
    case "right":
      return setTopRight;
    case "bottom":
      return setBottomRight;
    case "left":
      return setBottomLeft;
  }
};

export const unitSetter = (e: Edge): Setter<Unit.Unit, Value> => {
  switch (e) {
    case "all":
      return setUnit;
    case "top":
      return setTopLeftUnit;
    case "right":
      return setTopRightUnit;
    case "bottom":
      return setBottomRightUnit;
    case "left":
      return setBottomLeftUnit;
  }
};

export const unitTitle = (unit: Unit.Unit): string => {
  switch (unit) {
    case "%":
    case "px":
      return unit;
  }
};
