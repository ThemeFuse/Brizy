import type * as Option from "visual/component/Options/Type";
import type { SimpleValue } from "visual/component/Options/Type";
import { Toggle } from "visual/utils/options/utils/Type";
import { StringSpec } from "visual/utils/string/specs";

export const defaultValue: SimpleValue<Toggle> = {
  value: Toggle.ON
};

export const fromElementModel: Option.FromElementModel<"showOnDevice"> = (
  get
) => ({
  value: StringSpec.read(get("value"))
});

export const toElementModel: Option.ToElementModel<"showOnDevice"> = (
  values
) => {
  return {
    value: values.value
  };
};
