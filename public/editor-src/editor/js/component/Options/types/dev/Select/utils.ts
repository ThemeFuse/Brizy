import { Literal, read as readLiteral } from "visual/utils/types/Literal";
import { GetElementModel, GetModel } from "visual/component/Options/Type";
import { ElementModelValue, ChoicesSync, ChoicesAsync } from "./types";

export const getModel: GetModel<ElementModelValue> = get => ({
  value: readLiteral(get("value"))
});

export const getElementModel: GetElementModel<ElementModelValue> = (
  values,
  get
) => {
  return {
    [get("value")]: values.value
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
