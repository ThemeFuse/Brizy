import { parseStrict } from "fp-utilities";
import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import * as Arr from "visual/utils/array";
import { optional } from "visual/utils/reader/readWithParser";
import * as Str from "visual/utils/string/specs";
import * as Literal from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";
import { Value } from "./types";

export const fromElementModel: FromElementModel<"iconsPicker"> = parseStrict<
  (k: string) => MValue<Literal.Literal>,
  Value
>({
  value: (get) =>
    Arr.fromString(Literal.read, Str.read(get("value")) ?? "") ??
    defaultValue.value,
  active: optional((get) => Literal.read(get("active")))
});

export const toElementModel: ToElementModel<"iconsPicker"> = ({
  value,
  active
}) => ({ value: JSON.stringify(value), active });

export const defaultValue: Value = {
  value: []
};
