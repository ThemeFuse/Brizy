import { Literal, read as readLiteral } from "visual/utils/types/Literal";
import {
  ToElementModel,
  FromElementModel
} from "visual/component/Options/Type";
import { ElementModelValue, ChoicesSync, ChoicesAsync } from "./types";

export const getModel: FromElementModel<ElementModelValue> = get => ({
  value: readLiteral(get("value"))
});

export const getElementModel: ToElementModel<ElementModelValue> = values => {
  return {
    value: values.value
  };
};

export const toElement = (v: Literal): ElementModelValue => ({
  value: v
});

export const defaultValue = { value: "" };

export function isChoicesSync(
  choices: ChoicesSync | ChoicesAsync
): choices is ChoicesSync {
  return Array.isArray(choices);
}
