import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import {
  ElementModelValue,
  Value
} from "visual/component/Options/types/dev/MultiSelect2/types";
import * as Str from "visual/utils/reader/string";
import { read as readLiteral } from "visual/utils/types/Literal";

export const defaultValue: ElementModelValue = { value: [] };

export const fromElementModel: FromElementModel<"multiSelect"> = (get) => {
  let value: Value;
  try {
    value = JSON.parse(Str.read(get("value")) ?? "[]");
  } catch (_) {
    value = defaultValue.value;
  }

  if (!Array.isArray(value) || !value.length) {
    return defaultValue;
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

export const toElementModel: ToElementModel<"multiSelect"> = (value) => {
  return {
    value: JSON.stringify(value.value)
  };
};
