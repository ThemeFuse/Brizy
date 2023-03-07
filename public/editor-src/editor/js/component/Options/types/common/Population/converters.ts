import { mPipe, optional, parseStrict } from "fp-utilities";
import {
  FromElementModel,
  FromElementModelGetter,
  ToElementModel,
  callGetter
} from "visual/component/Options/Type";
import { fromString } from "visual/utils/string/NoEmptyString";
import * as Str from "visual/utils/string/specs";
import { Value } from "./types/Value";

export const defaultValue: Value = {
  population: undefined
};

export const fromElementModel: FromElementModel<"population-dev"> = parseStrict<
  FromElementModelGetter,
  Value
>({
  population: optional(mPipe(callGetter("population"), Str.read, fromString))
});

export const toElementModel: ToElementModel<"population-dev"> = (value) =>
  value;
