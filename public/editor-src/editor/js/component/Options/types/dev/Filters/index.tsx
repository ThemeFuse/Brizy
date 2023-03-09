import { mPipe } from "fp-utilities";
import React, { FC } from "react";
import { Slider } from "visual/component/Controls/Spacing/Slider";
import * as Option from "visual/component/Options/Type";
import { fromNumber } from "visual/utils/math/Positive";
import { FilterSlider } from "./FilterSlider";
import { Value } from "./types/Value";
import { empty, set } from "./utils";

export const Filters: FC<Option.Props<Value>> = ({ value, onChange }) => {
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
        title="Hue"
      />
      <FilterSlider
        className="brz-ed-control__filters__saturation"
        icon="nc-saturation"
        value={value.saturation}
        onChange={mPipe(fromNumber, set("saturation", value), onChange)}
        title="Saturation"
      />
      <FilterSlider
        className="brz-ed-control__filters__brightness"
        icon="nc-brightness"
        value={value.brightness}
        onChange={mPipe(fromNumber, set("brightness", value), onChange)}
        title="Brightness"
      />
      <FilterSlider
        className="brz-ed-control__filters__contrast"
        icon="nc-contrast"
        value={value.contrast}
        onChange={mPipe(fromNumber, set("contrast", value), onChange)}
        title="Contrast"
      />
    </div>
  );
};
