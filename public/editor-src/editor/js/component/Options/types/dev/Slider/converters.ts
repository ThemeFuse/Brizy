import * as Option from "visual/component/Options/Type";
import { Value } from "visual/component/Options/types/dev/Slider/types/Value";
import { NumberSpec } from "visual/utils/math/number";
import { String } from "visual/utils/string/specs";

export const defaultValue: Value = {
  value: 0,
  unit: ""
};

export const fromElementModel: Option.FromElementModel<"slider"> = (get) => {
  return {
    value: NumberSpec.read(get("value")) ?? defaultValue.value,
    unit: String.read(get("suffix")) ?? defaultValue.unit
  };
};

export const toElementModel: Option.ToElementModel<"slider"> = (values) => {
  return {
    value: values.value,
    suffix: values.unit
  };
};
