import { mPipe } from "fp-utilities";
import React from "react";
import { Slider } from "visual/component/Controls/Spacing/Slider";
import * as Option from "visual/component/Options/Type";
import { GlobalMeta } from "visual/component/Options/Type";
import { t } from "visual/utils/i18n";
import { fromNumber } from "visual/utils/math/Positive";
import { Meta } from "visual/utils/options/Filters/meta";
import { empty, set } from "visual/utils/options/Filters/utils";
import { FilterSlider } from "./FilterSlider";
import { Value } from "./types/Value";

interface Props extends Option.Props<Value>, Option.Meta<Meta> {}

export const Filters = ({ value, onChange }: Props): JSX.Element => {
  const handleChange = (
    type: "hue" | "saturation" | "brightness" | "contrast",
    v: number,
    m?: GlobalMeta
  ) => {
    const _value = mPipe(fromNumber, set(type, value))(v);
    const meta = { isChanging: !!m?.isChanging };

    if (_value) {
      onChange(_value, meta);
    }
  };

  return (
    <div className="brz-ed-control__filters">
      <Slider
        className={"brz-ed-control__filters__hue"}
        icon="nc-hue"
        value={value.hue}
        unit="deg"
        onValue={(v: number, m?: GlobalMeta) => handleChange("hue", v, m)}
        onUnit={empty}
        units={[{ value: "deg", title: "deg" }]}
        step={1}
        min={0}
        max={360}
        title={t("Hue")}
      />
      <FilterSlider
        className="brz-ed-control__filters__saturation"
        icon="nc-saturation"
        value={value.saturation}
        onChange={(v: number, m?: GlobalMeta) =>
          handleChange("saturation", v, m)
        }
        title={t("Saturation")}
      />
      <FilterSlider
        className="brz-ed-control__filters__brightness"
        icon="nc-brightness"
        value={value.brightness}
        onChange={(v: number, m?: GlobalMeta) =>
          handleChange("brightness", v, m)
        }
        title={t("Brightness")}
      />
      <FilterSlider
        className="brz-ed-control__filters__contrast"
        icon="nc-contrast"
        value={value.contrast}
        onChange={(v: number, m?: GlobalMeta) => handleChange("contrast", v, m)}
        title={t("Contrast")}
      />
    </div>
  );
};
