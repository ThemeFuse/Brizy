import * as Option from "visual/component/Options/Type";
import { Value } from "./types";
import * as Literal from "visual/utils/types/Literal";
import { parseStrict, optional } from "visual/utils/reader/readWithParser";
import * as Str from "visual/utils/string/specs";
import * as Arr from "visual/utils/array";
import { MValue } from "visual/utils/value";

export const getModel: Option.GetModel<Value> = parseStrict<
  (k: string) => MValue<Literal.Literal>,
  Value
>({
  value: get =>
    Arr.fromString(Literal.read, Str.read(get("value")) ?? "") ?? [],
  active: optional(get => Literal.read(get("active")))
});

export const getElementModel: Option.GetElementModel<Value> = ({
  value,
  active
}) => ({ value: JSON.stringify(value), active });
