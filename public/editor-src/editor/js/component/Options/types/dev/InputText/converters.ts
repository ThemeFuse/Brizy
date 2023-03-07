import * as Option from "visual/component/Options/Type";
import { Model } from "./Type";
import { String } from "visual/utils/string/specs";

export const defaultValue: Model = {
  value: ""
};

export const fromElementModel: Option.FromElementModel<"inputText-dev"> = get => ({
  value: String.read(get("value"))
});

export const toElementModel: Option.ToElementModel<"inputText-dev"> = values => {
  return {
    value: values.value
  };
};
