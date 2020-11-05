import { String } from "visual/utils/string/specs";
import { GetModel, SimpleValue } from "visual/component/Options/Type";
import { Value, read } from "./Value";
import { ChoicesSync, ChoicesAsync } from "./types";

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

export function isChoicesSync(
  choices: ChoicesSync | ChoicesAsync
): choices is ChoicesSync {
  return Array.isArray(choices);
}

export function selectedChoices(
  value: Value[],
  choices: ChoicesSync
): ChoicesSync {
  return choices.filter(c => value.includes(c.value));
}

export function searchChoices(s: string, choices: ChoicesSync): ChoicesSync {
  return choices.filter(({ title }) =>
    title.toLowerCase().includes(s.toLowerCase())
  );
}

export function mergeChoices(c1: ChoicesSync, c2: ChoicesSync): ChoicesSync {
  const c1Values = new Set(c1.map(c => c.value));
  return c1.concat(c2.filter(c => !c1Values.has(c.value)));
}
