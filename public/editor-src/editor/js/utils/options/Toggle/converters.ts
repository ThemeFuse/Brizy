import type * as Option from "visual/component/Options/Type";
import type { SimpleValue } from "visual/component/Options/Type";
import { StringSpec } from "visual/utils/string/specs";
import type { Literal } from "visual/utils/types/Literal";

export const defaultValue: SimpleValue<Literal> = {
  value: ""
};

export const fromElementModel: Option.FromElementModel<"toggle"> = (get) => ({
  value: StringSpec.read(get("value")) ?? defaultValue.value
});

export const toElementModel: Option.ToElementModel<"toggle"> = (values) => {
  return {
    value: values.value
  };
};
