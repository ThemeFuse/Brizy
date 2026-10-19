import type * as Option from "visual/component/Options/Type";
import type { SimpleValue } from "visual/component/Options/Type";
import { StringSpec } from "visual/utils/string/specs";

export const defaultValue: SimpleValue<string> = {
  value: ""
};

export const fromElementModel: Option.FromElementModel<"textarea"> = (get) => ({
  value: StringSpec.read(get("value")) ?? defaultValue.value
});

export const toElementModel: Option.ToElementModel<"textarea"> = (values) => {
  return {
    value: values.value
  };
};
