import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import { ElementModelValue } from "visual/component/Options/types/dev/Select/types";
import { read as readLiteral } from "visual/utils/types/Literal";

export const fromElementModel: FromElementModel<"select"> = (get) => ({
  value: readLiteral(get("value"))
});

export const toElementModel: ToElementModel<"select"> = (values) => {
  return {
    value: values.value ?? defaultValue.value
  };
};

export const defaultValue: ElementModelValue = { value: "" };
