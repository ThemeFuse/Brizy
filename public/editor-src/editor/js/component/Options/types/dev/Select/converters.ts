import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import { ElementModelValue } from "./types";
import { read as readLiteral } from "visual/utils/types/Literal";

export const fromElementModel: FromElementModel<"select-dev"> = get => ({
  value: readLiteral(get("value"))
});

export const toElementModel: ToElementModel<"select-dev"> = values => {
  return {
    value: values.value
  };
};

export const defaultValue: ElementModelValue = { value: "" };
