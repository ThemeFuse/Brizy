import { Value as NV } from "visual/component/Controls/NumberUnit/types";
import { Props as SpacingPops } from "visual/component/Controls/Spacing";
import { Edge } from "visual/component/Controls/Spacing/types";
import { Setter } from "visual/utils/model";
import {
  Value,
  setBottom,
  setBottomUnit,
  setLeft,
  setLeftUnit,
  setRight,
  setRightUnit,
  setTop,
  setTopUnit,
  setUnit,
  setValue
} from "visual/utils/options/Margin/types/Value";
import * as Unit from "visual/utils/options/utils/SpacingUnit";
import { readWithParser } from "visual/utils/reader/readWithParser";
import { Config } from "./types/Config";

export const fromNumberSlider = readWithParser<
  NV<Unit.SpacingUnit>,
  { number: number; unit: Unit.SpacingUnit }
>({
  number: (v) => v.number,
  unit: (v) => v.unit
});

export const getIcon: SpacingPops<Unit.SpacingUnit, Edge>["getIcon"] = (e) => {
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
