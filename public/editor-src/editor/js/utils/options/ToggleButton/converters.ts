import * as Option from "visual/component/Options/Type";
import { SimpleValue } from "visual/component/Options/Type";
import { readToggle } from "./utils";

export const defaultValue: SimpleValue<boolean> = {
  value: false
};

export const fromElementModel: Option.FromElementModel<"toggleButton"> = (
  get
) => ({
  value: readToggle(get("value")) ?? defaultValue.value
});

export const toElementModel: Option.ToElementModel<"toggleButton"> = (
  value
) => ({ value });
