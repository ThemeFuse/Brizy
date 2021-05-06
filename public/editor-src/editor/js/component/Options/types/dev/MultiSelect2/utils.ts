import _ from "underscore";
import * as Str from "visual/utils/reader/string";
import { read as readLiteral } from "visual/utils/types/Literal";
import { t } from "visual/utils/i18n";
import { printf } from "visual/utils/string";
import {
  GetElementModel,
  GetModel,
  SimpleValue
} from "visual/component/Options/Type";
import { Value, ChoicesSync, ChoicesAsync, ElementModelValue } from "./types";

export const DEFAULT_VALUE: ElementModelValue = { value: [] };

export const getModel: GetModel<ElementModelValue> = get => {
  let value: Value;
  try {
    value = JSON.parse(Str.read(get("value")) ?? "[]");
  } catch (e) {
    value = DEFAULT_VALUE.value;
  }

  if (!Array.isArray(value) || !value.length) {
    return DEFAULT_VALUE;
  }

  const v = value.reduce((acc: Value, i) => {
    const value = readLiteral(i);

    if (value) {
      acc.push(value);
    }

    return acc;
  }, []);

  return { value: v };
};

export const getElementModel: GetElementModel<ElementModelValue> = (
  value,
  get
) => {
  return {
    [get("value")]: value.value
  };
};

export const toElement = (v: Value): SimpleValue<string> => ({
  value: JSON.stringify(v)
});

export function isChoicesSync(
  choices: ChoicesSync | ChoicesAsync
): choices is ChoicesSync {
  return Array.isArray(choices);
}

export function valueChoices(value: Value, choices: ChoicesSync): ChoicesSync {
  return choices.filter(c => value.includes(c.value));
}

export function missingChoices(
  value: Value,
  choices: ChoicesSync
): ChoicesSync {
  return _.difference(value, _.pluck(choices, "value")).map(v => ({
    title: printf(t("? (%s)"), Str.read(v) ?? "?"),
    value: v
  }));
}

export function searchChoices(s: string, choices: ChoicesSync): ChoicesSync {
  if (s === "") {
    return choices;
  }

  return choices.filter(({ title }) =>
    title.toLowerCase().includes(s.toLowerCase())
  );
}

export function mergeChoices(
  c1: ChoicesSync,
  c2: ChoicesSync,
  ...cr: ChoicesSync[]
): ChoicesSync {
  const seenValues = new Set();
  const result: ChoicesSync = [];
  for (const choices_ of [c1, c2, ...cr]) {
    for (const choice of choices_) {
      if (!seenValues.has(choice.value)) {
        seenValues.add(choice.value);
        result.push(choice);
      }
    }
  }

  return result;
}
