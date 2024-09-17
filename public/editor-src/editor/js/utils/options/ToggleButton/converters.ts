import * as Option from "visual/component/Options/Type";
import { SimpleValue } from "visual/component/Options/Type";
import { Literal } from "visual/utils/types/Literal";

export const defaultValue: SimpleValue<Literal> = {
  value: ""
};

export const fromElementModel: Option.FromElementModel<"toggleButton"> = (
  get
) => ({
  value: get("value") ?? defaultValue.value
});

export const toElementModel: Option.ToElementModel<"toggleButton"> = (
  values
) => {
  return {
    value: values.value
  };
};
