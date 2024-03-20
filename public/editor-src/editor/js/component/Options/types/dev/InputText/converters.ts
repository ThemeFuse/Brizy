import * as Option from "visual/component/Options/Type";
import { String } from "visual/utils/string/specs";
import { Model } from "./Type";

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
