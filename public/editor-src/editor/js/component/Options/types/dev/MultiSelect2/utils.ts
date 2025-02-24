import { difference } from "es-toolkit";
import { t } from "visual/utils/i18n";
import * as Str from "visual/utils/reader/string";
import { printf } from "visual/utils/string";
import { ChoicesAsync, ChoicesSync, Value } from "./types";

export function isChoicesSync(
  choices: ChoicesSync | ChoicesAsync
): choices is ChoicesSync {
  return Array.isArray(choices);
}

export function valueChoices(value: Value, choices: ChoicesSync): ChoicesSync {
  return choices.filter((c) => value.includes(c.value));
}

export function missingChoices(
  value: Value,
  choices: ChoicesSync
): ChoicesSync {
  return difference(
    value,
    choices.map((o) => o.value)
  ).map((v) => ({
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
