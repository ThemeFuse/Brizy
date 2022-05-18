import { Setter } from "visual/utils/model";
import * as Str from "visual/utils/string/specs";
import * as Num from "visual/utils/math/number";
import {
  parseStrict,
  readWithParser
} from "visual/utils/reader/readWithParser";
import { mPipe, pipe } from "visual/utils/fp";
import { MValue, onNullish } from "visual/utils/value";
import { Literal } from "visual/utils/types/Literal";
import {
  ToElementModel,
  FromElementModel
} from "visual/component/Options/Type";
import * as Unit from "visual/component/Options/utils/SpacingUnit";
import * as Type from "visual/component/Options/utils/Type";
import { Value as NV } from "visual/component/Controls/NumberUnit/types";
import { Props as SP } from "visual/component/Controls/Spacing";
import { Edge } from "visual/component/Controls/Spacing/types";
import { Props as SpacingPops } from "visual/component/Controls/Spacing";
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
import { Config } from "./types/Config";

type Get = (k: string) => MValue<Literal>;
const call = (k: string) => (get: Get): MValue<Literal> => get(k);

export const fromElementModel: FromElementModel<Value> = parseStrict<
  Get,
  Value
>({
  type: pipe(
    mPipe(call("type"), Str.read, Type.fromString),
    onNullish("grouped" as Type.Type)
  ),
  value: pipe(mPipe(call("value"), Num.read), onNullish(0)),
  tempValue: pipe(mPipe(call("tempValue"), Num.read), onNullish(0)),
  unit: pipe(
    mPipe(call("suffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  tempUnit: pipe(
    mPipe(call("tempSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  top: pipe(mPipe(call("top"), Num.read), onNullish(0)),
  tempTop: pipe(mPipe(call("tempTop"), Num.read), onNullish(0)),
  topUnit: pipe(
    mPipe(call("topSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  tempTopUnit: pipe(
    mPipe(call("tempTopSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  right: pipe(mPipe(call("right"), Num.read), onNullish(0)),
  tempRight: pipe(mPipe(call("tempRight"), Num.read), onNullish(0)),
  rightUnit: pipe(
    mPipe(call("rightSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  tempRightUnit: pipe(
    mPipe(call("tempRightSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  bottom: pipe(mPipe(call("bottom"), Num.read), onNullish(0)),
  tempBottom: pipe(mPipe(call("tempBottom"), Num.read), onNullish(0)),
  bottomUnit: pipe(
    mPipe(call("bottomSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  tempBottomUnit: pipe(
    mPipe(call("tempBottomSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  left: pipe(mPipe(call("left"), Num.read), onNullish(0)),
  tempLeft: pipe(mPipe(call("tempLeft"), Num.read), onNullish(0)),
  leftUnit: pipe(
    mPipe(call("leftSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  tempLeftUnit: pipe(
    mPipe(call("tempLeftSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  )
});

export const toElementModel: ToElementModel<Value> = v => {
  return {
    type: v.type,
    value: v.value,
    tempValue: v.tempValue,
    suffix: v.unit,
    tempSuffix: v.tempUnit,
    top: v.top,
    tempTop: v.tempTop,
    topSuffix: v.topUnit,
    tempTopSuffix: v.tempTopUnit,
    right: v.right,
    tempRight: v.tempRight,
    rightSuffix: v.rightUnit,
    tempRightSuffix: v.tempRightUnit,
    bottom: v.bottom,
    tempBottom: v.tempBottom,
    bottomSuffix: v.bottomUnit,
    tempBottomSuffix: v.tempBottomUnit,
    left: v.left,
    tempLeft: v.tempLeft,
    leftSuffix: v.leftUnit,
    tempLeftSuffix: v.tempLeftUnit
  };
};

export const defaultValue: Value = {
  type: "grouped",
  value: 0,
  tempValue: 0,
  unit: "px",
  tempUnit: "px",
  top: 0,
  tempTop: 0,
  topUnit: "px",
  tempTopUnit: "px",
  right: 0,
  tempRight: 0,
  rightUnit: "px",
  tempRightUnit: "px",
  bottom: 0,
  tempBottom: 0,
  bottomUnit: "px",
  tempBottomUnit: "px",
  left: 0,
  tempLeft: 0,
  leftUnit: "px",
  tempLeftUnit: "px"
};

export const fromNumberSlider = readWithParser<
  NV<Unit.SpacingUnit>,
  { number: number; unit: Unit.SpacingUnit }
>({
  number: v => v.number,
  unit: v => v.unit
});

export const getIcon: SP<Unit.SpacingUnit, Edge>["getIcon"] = e => {
  switch (e) {
    case "grouped":
      return "nc-styling-all";
    case "ungrouped":
      return "nc-styling-individual";
    case "top":
      return "nc-styling-top";
    case "right":
      return "nc-styling-right";
    case "bottom":
      return "nc-styling-bottom";
    case "left":
      return "nc-styling-left";
  }
};

export const valueSetter = (e: Edge): Setter<number, Value> => {
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

export type T<E extends "all" | "vertical" | "horizontal"> = {
  all: SpacingPops<Unit.SpacingUnit, Edge>;
  vertical: SpacingPops<Unit.SpacingUnit, "top" | "bottom">;
  horizontal: SpacingPops<Unit.SpacingUnit, "left" | "right">;
}[E]["value"];

export function toSpacingValue<E extends Config["edges"]>(
  edges: E,
  v: Value
): T<E> {
  switch (edges as Config["edges"]) {
    case "all": {
      return {
        all: {
          number: v.value,
          unit: v.unit
        },
        top: {
          number: v.top,
          unit: v.topUnit
        },
        right: {
          number: v.right,
          unit: v.rightUnit
        },
        bottom: {
          number: v.bottom,
          unit: v.bottomUnit
        },
        left: {
          number: v.left,
          unit: v.leftUnit
        }
      };
    }
    case "vertical": {
      return {
        all: {
          number: v.value,
          unit: v.unit
        },
        top: {
          number: v.top,
          unit: v.topUnit
        },
        bottom: {
          number: v.bottom,
          unit: v.bottomUnit
        }
      } as T<"vertical">;
    }
    case "horizontal": {
      return {
        all: {
          number: v.value,
          unit: v.unit
        },
        right: {
          number: v.right,
          unit: v.rightUnit
        },
        left: {
          number: v.left,
          unit: v.leftUnit
        }
      } as T<"horizontal">;
    }
  }
}
