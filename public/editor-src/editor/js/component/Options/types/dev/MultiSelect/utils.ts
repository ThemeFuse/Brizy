import { String } from "visual/utils/string/specs";
import { Literal } from "visual/utils/types/Literal";
import {
  GetModel,
  GetElementModel,
  SimpleValue
} from "visual/component/Options/Type";
import { Value, read } from "./Value";
import { ChoicesSync, ChoicesAsync } from "./types";

export const DEFAULT_VALUE: Value = { value: [] };

export const getModel: GetModel<Value> = get => {
  let value: Literal[];
  try {
    value = JSON.parse(String.read(get("value")) ?? "[]");
  } catch (e) {
    value = DEFAULT_VALUE.value;
  }

  if (!Array.isArray(value) || !value.length) {
    return DEFAULT_VALUE;
  }

  const v = value.reduce((acc: Literal[], i) => {
    const value = read(i);

    if (value) {
      acc.push(value);
    }

    return acc;
  }, []);

  return { value: v };
};

export const getElementModel: GetElementModel<Value> = (values, get) => {
  return {
    [get("value")]: values.value
  };
};

export const toElement = (v: Value["value"]): SimpleValue<Literal> => ({
  value: JSON.stringify(v)
});

export function isChoicesSync(
  choices: ChoicesSync | ChoicesAsync
): choices is ChoicesSync {
  return Array.isArray(choices);
}

export function selectedChoices(
  value: Value["value"],
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
