import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import { ElementModelValue } from "visual/component/Options/types/dev/EditableSelect/types";
import { read as readLiteral } from "visual/utils/types/Literal";

export const fromElementModel: FromElementModel<"editableSelect"> = (get) => ({
  value: readLiteral(get("value"))
});

export const toElementModel: ToElementModel<"editableSelect"> = (values) => {
  return {
    value: values.payload
  };
};

export const defaultValue: ElementModelValue = { value: "" };
