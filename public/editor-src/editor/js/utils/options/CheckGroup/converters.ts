import * as Option from "visual/component/Options/Type";
import { SimpleValue } from "visual/component/Options/Type";
import * as Bool from "visual/utils/reader/bool";

export const defaultValue: SimpleValue<boolean> = {
  value: false
};

export const fromElementModel: Option.FromElementModel<"checkGroup"> = (
  get
) => ({
  value: Bool.read(get("value")) ?? defaultValue.value
});

export const toElementModel: Option.ToElementModel<"checkGroup"> = (
  values
) => ({
  value: values.value
});
