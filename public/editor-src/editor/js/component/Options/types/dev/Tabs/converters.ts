import * as Option from "visual/component/Options/Type";
import { SimpleValue } from "visual/component/Options/Type";
import { Literal, read } from "visual/utils/types/Literal";

export const defaultValue: SimpleValue<Literal> = { value: "" };

export const fromElementModel: Option.FromElementModel<"tabs"> = get => ({
  value: read(get("value"))
});

export const toElementModel: Option.ToElementModel<"tabs"> = values => {
  return {
    value: values.value
  };
};
