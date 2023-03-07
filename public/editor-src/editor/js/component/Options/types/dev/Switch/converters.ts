import * as Option from "visual/component/Options/Type";
import { String } from "visual/utils/string/specs";
import { SimpleValue } from "visual/component/Options/Type";
import { Literal } from "visual/utils/types/Literal";

export const defaultValue: SimpleValue<Literal> = {
  value: ""
};

export const fromElementModel: Option.FromElementModel<"switch-dev"> = get => ({
  value: String.read(get("value"))
});

export const toElementModel: Option.ToElementModel<"switch-dev"> = values => {
  return {
    value: values.value
  };
};
