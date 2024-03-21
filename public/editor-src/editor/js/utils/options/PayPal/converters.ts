import { pass } from "fp-utilities";
import * as Option from "visual/component/Options/Type";
import { Model } from "visual/component/Options/types/dev/PayPal/Type";
import * as NoEmptyStr from "visual/utils/string/NoEmptyString";
import * as Str from "visual/utils/string/specs";

export const defaultValue: Model = {
  value: undefined
};

export const fromElementModel: Option.FromElementModel<"paypal"> = (get) => ({
  value: pass(NoEmptyStr.is)(Str.read(get("value")) ?? "")
});

export const toElementModel: Option.ToElementModel<"paypal"> = (values) => {
  return {
    value: values.value
  };
};
