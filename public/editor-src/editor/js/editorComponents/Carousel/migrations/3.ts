import { Deps, Migration } from "visual/utils/migration";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import { ArrowStyle } from "../types";

export const m3: Migration<Deps<unknown>> = {
  version: 3,
  cb({ v }) {
    if (!Obj.isObject(v)) {
      throw new Error(`Carousel migration 3 input failed ${v}`);
    }

    const sliderArrows = Str.read(v.sliderArrows);
    const arrowStyle = Str.read(v.arrowStyle);

    // If sliderArrows is "none" and arrowStyle is not already set to "style-3"
    if (sliderArrows === "none" && arrowStyle !== "style-3") {
      return {
        ...v,
        arrowStyle: ArrowStyle.style3
      };
    }

    return v;
  }
};
