import * as Option from "visual/component/Options/Type";
import { SimpleValue } from "visual/component/Options/Type";
import { String } from "visual/utils/string/specs";

export const defaultValue: SimpleValue<string> = {
  value: ""
};

export const fromElementModel: Option.FromElementModel<"textarea"> = (get) => ({
  value: String.read(get("value"))
});

export const toElementModel: Option.ToElementModel<"textarea"> = (values) => {
  return {
    value: values.value
  };
};
