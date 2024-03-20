import * as Option from "visual/component/Options/Type";
import { SimpleValue } from "visual/component/Options/Type";
import { String } from "visual/utils/string/specs";
import { Literal } from "visual/utils/types/Literal";

export const defaultValue: SimpleValue<Literal> = {
  value: ""
};

export const fromElementModel: Option.FromElementModel<"switch"> = (get) => ({
  value: String.read(get("value")) ?? defaultValue.value
});

export const toElementModel: Option.ToElementModel<"switch"> = (values) => {
  return {
    value: values.value
  };
};
