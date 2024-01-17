import * as O from "visual/component/Options/Type";
import { SimpleValue } from "visual/component/Options/Type";
import { Literal } from "visual/utils/types/Literal";
import * as L from "visual/utils/types/Literal";

export const defaultValue: SimpleValue<Literal> = { value: "" };

export const fromElementModel: O.FromElementModel<"radioGroup"> = (get) => ({
  value: L.read(get("value"))
});

export const toElementModel: O.ToElementModel<"radioGroup"> = (values) => {
  return {
    value: values.value
  };
};
