import { MValue } from "visual/utils/value";
import { printf } from "visual/utils/string";
import { t } from "visual/utils/i18n";
import { MultiSelectItemProps } from "./types";

type ValueTitle = (
  t: (key: string) => string
) => <T>(items: MultiSelectItemProps<T>[], value: T[]) => MValue<string>;
export const _valueTitle: ValueTitle = t => (
  items,
  value
): string | undefined => {
  const valueItems = items.filter(item => value.includes(item.value));

  if (valueItems.length === 1) {
    return valueItems[0].title;
  }

  if (valueItems.length > 1) {
    return printf(t("%s Selected"), String(valueItems.length));
  }

  return undefined;
};
export const valueTitle = _valueTitle(t);

export const arrangeItems = <T>(
  items: MultiSelectItemProps<T>[],
  value: T[]
): MultiSelectItemProps<T>[] => {
  const valueItems = [];
  const nonValueItems = [];

  for (const item of items) {
    if (value.includes(item.value)) {
      valueItems.push(item);
    } else {
      nonValueItems.push(item);
    }
  }

  return valueItems.concat(nonValueItems);
};

export const toggleItemValue = <T>(
  item: MultiSelectItemProps<T>,
  value: T[]
): T[] => {
  return value.includes(item.value)
    ? value.filter(v => v !== item.value)
    : value.concat(item.value);
};
