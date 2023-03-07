import { pass } from "fp-utilities";
import * as Option from "visual/component/Options/Type";
import * as NoEmptyStr from "visual/utils/string/NoEmptyString";
import * as Str from "visual/utils/string/specs";
import { Model } from "./Type";

export const defaultValue: Model = {
  value: undefined
};

export const fromElementModel: Option.FromElementModel<"paypal-dev"> = (
  get
) => ({
  value: pass(NoEmptyStr.is)(Str.read(get("value")) ?? "")
});

export const toElementModel: Option.ToElementModel<"paypal-dev"> = (values) => {
  return {
    value: values.value
  };
};
