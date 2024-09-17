import * as Option from "visual/component/Options/Type";
import { SimpleValue } from "visual/component/Options/Type";
import { String } from "visual/utils/string/specs";
import { Toggle } from "visual/utils/options/utils/Type";

export const defaultValue: SimpleValue<Toggle> = {
  value: Toggle.ON
};

export const fromElementModel: Option.FromElementModel<"showOnDevice"> = (
  get
) => ({
  value: String.read(get("value"))
});

export const toElementModel: Option.ToElementModel<"showOnDevice"> = (
  values
) => {
  return {
    value: values.value
  };
};
