import { t } from "visual/utils/i18n";
import { printf } from "visual/utils/string";
import { MValue } from "visual/utils/value";
import { MultiSelectItemProps } from "./types";

type ValueTitle = (
  t: (key: string) => string
) => <T>(items: MultiSelectItemProps<T>[], value: T[]) => MValue<string>;

export const _valueTitle: ValueTitle =
  (t) =>
  (items, value): string | undefined => {
    const valueItems = items.filter((item) => value.includes(item.value));

    if (valueItems.length === 1) {
      return valueItems[0].title;
    }

    if (valueItems.length > 1) {
      if (valueItems.length === items.length) {
        return printf(t("All %s selected"), String(valueItems.length));
      }
      return printf(t("%s Selected"), String(valueItems.length));
    }

    return undefined;
  };

export const valueTitle = _valueTitle(t);

export const toggleItemValue = <T>(
  item: MultiSelectItemProps<T>,
  value: T[],
  useAsSimpleSelect?: boolean
): T[] => {
  return value.includes(item.value)
    ? value.filter((v) => v !== item.value)
    : useAsSimpleSelect
      ? [item.value]
      : value.concat(item.value);
};
