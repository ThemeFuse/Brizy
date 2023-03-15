import * as Option from "visual/component/Options/Type";
import { SimpleValue } from "visual/component/Options/Type";
import { NumberSpec } from "visual/utils/math/number";

export const defaultValue: SimpleValue<number> = { value: 0 };

export const fromElementModel: Option.FromElementModel<"number-dev"> = get => ({
  value: NumberSpec.read(get("value"))
});

export const toElementModel: Option.ToElementModel<"number-dev"> = values => {
  return {
    value: values.value
  };
};
