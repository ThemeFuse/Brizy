import React, { FC } from "react";
import { mPipe } from "fp-utilities";
import * as Option from "visual/component/Options/Type";
import { OptionType } from "visual/component/Options/Type";
import { Value } from "./types/Value";
import { Slider } from "visual/component/Controls/Spacing/Slider";
import { empty, fromElementModel, set, toElementModel } from "./utils";
import { fromNumber } from "visual/utils/math/Positive";
import { FilterSlider } from "./FilterSlider";

export const Filters: OptionType<Value> & FC<Option.Props<Value>> = ({
  value,
  onChange
}) => {
  return (
    <div className="brz-ed-control__filters">
      <Slider
        className={"brz-ed-control__filters__hue"}
        icon="nc-hue"
        value={value.hue}
        unit="deg"
        onValue={mPipe(set("hue", value), onChange)}
        onUnit={empty}
        units={[{ value: "deg", title: "deg" }]}
        step={1}
        min={0}
        max={360}
      />
      <FilterSlider
        className="brz-ed-control__filters__saturation"
        icon="nc-saturation"
        value={value.saturation}
        onChange={mPipe(fromNumber, set("saturation", value), onChange)}
      />
      <FilterSlider
        className="brz-ed-control__filters__brightness"
        icon="nc-brightness"
        value={value.brightness}
        onChange={mPipe(fromNumber, set("brightness", value), onChange)}
      />
      <FilterSlider
        className="brz-ed-control__filters__contrast"
        icon="nc-contrast"
        value={value.contrast}
        onChange={mPipe(fromNumber, set("contrast", value), onChange)}
      />
    </div>
  );
};

Filters.defaultValue = {
  hue: 0,
  saturation: 0,
  contrast: 0,
  brightness: 0
};
Filters.fromElementModel = fromElementModel;
Filters.toElementModel = toElementModel;
