import { String } from "visual/utils/string/specs";
import { GetModel, SimpleValue } from "visual/component/Options/Type";
import { Value, read } from "./Value";

export const getModel: GetModel<Value[]> = get => {
  let value: Value[];
  try {
    value = JSON.parse(String.read(get("value")) ?? "");
  } catch (e) {
    value = [];
  }

  if (!Array.isArray(value) || !value.length) {
    return [];
  }

  return value.reduce((acc: Value[], i) => {
    const value = read(i);

    if (value) {
      acc.push(value);
    }

    return acc;
  }, []);
};

export const toElement = (v: Value[]): SimpleValue<Value> => ({
  value: JSON.stringify(v)
});
