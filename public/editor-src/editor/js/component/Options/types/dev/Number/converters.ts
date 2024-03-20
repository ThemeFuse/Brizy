import * as Option from "visual/component/Options/Type";
import { SimpleValue } from "visual/component/Options/Type";
import { NumberSpec } from "visual/utils/math/number";

export const defaultValue: SimpleValue<number> = { value: 0 };

export const fromElementModel: Option.FromElementModel<"number"> = (get) => ({
  value: NumberSpec.read(get("value")) ?? defaultValue.value
});

export const toElementModel: Option.ToElementModel<"number"> = (values) => {
  return {
    value: values.value
  };
};
