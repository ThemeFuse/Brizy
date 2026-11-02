import type * as Option from "visual/component/Options/Type";
import type { Model } from "visual/component/Options/types/dev/InputText/Type";
import { StringSpec } from "visual/utils/string/specs";

export const defaultValue: Model = {
  value: ""
};

export const fromElementModel: Option.FromElementModel<"inputText"> = (
  get
) => ({
  value: StringSpec.read(get("value")) ?? defaultValue.value
});

export const toElementModel: Option.ToElementModel<"inputText"> = (values) => {
  return {
    value: values.value
  };
};
