import * as Option from "visual/component/Options/Type";
import { String } from "visual/utils/string/specs";
import { SimpleValue } from "visual/component/Options/Type";

export const defaultValue: SimpleValue<string> = {
  value: ""
};

export const fromElementModel: Option.FromElementModel<"codeMirror-dev"> = get => ({
  value: String.read(get("value"))
});

export const toElementModel: Option.ToElementModel<"codeMirror-dev"> = values => {
  return {
    value: values.value
  };
};
