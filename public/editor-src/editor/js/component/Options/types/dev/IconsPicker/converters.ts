import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import { Value } from "./types";
import * as Literal from "visual/utils/types/Literal";
import { parseStrict, optional } from "visual/utils/reader/readWithParser";
import * as Str from "visual/utils/string/specs";
import * as Arr from "visual/utils/array";
import { MValue } from "visual/utils/value";

export const fromElementModel: FromElementModel<"iconsPicker-dev"> = parseStrict<
  (k: string) => MValue<Literal.Literal>,
  Value
>({
  value: get =>
    Arr.fromString(Literal.read, Str.read(get("value")) ?? "") ?? [],
  active: optional(get => Literal.read(get("active")))
});

export const toElementModel: ToElementModel<"iconsPicker-dev"> = ({
  value,
  active
}) => ({ value: JSON.stringify(value), active });

export const defaultValue: Value = {
  value: []
};
