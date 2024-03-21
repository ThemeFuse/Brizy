import * as Option from "visual/component/Options/Type";
import { Model } from "visual/component/Options/types/dev/InputText/Type";
import { String } from "visual/utils/string/specs";

export const defaultValue: Model = {
  value: ""
};

export const fromElementModel: Option.FromElementModel<"inputText"> = (
  get
) => ({
  value: String.read(get("value")) ?? defaultValue.value
});

export const toElementModel: Option.ToElementModel<"inputText"> = (values) => {
  return {
    value: values.value
  };
};
