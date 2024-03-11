import * as Option from "visual/component/Options/Type";
import { SimpleValue } from "visual/component/Options/Type";
import { String } from "visual/utils/string/specs";

export const defaultValue: SimpleValue<string> = {
  value: ""
};

export const fromElementModel: Option.FromElementModel<"codeMirror"> = (
  get
) => ({
  value: String.read(get("value")) ?? defaultValue.value
});

export const toElementModel: Option.ToElementModel<"codeMirror"> = (values) => {
  return {
    value: values.value
  };
};
