import { mPipe, parse, pass } from "fp-utilities";
import {
  FromElementModel,
  FromElementModelGetter,
  ToElementModel
} from "visual/component/Options/Type";
import { call } from "visual/component/Options/types/dev/Animation/utils";
import { pipe } from "visual/utils/fp";
import * as NoEmptyString from "visual/utils/string/NoEmptyString";
import * as Str from "visual/utils/string/specs";

export interface WithValue {
  name: string;
  type: string;
}

export type Value = undefined | WithValue;

export const fromElementModel: FromElementModel<Value> = parse<
  FromElementModelGetter,
  WithValue
>({
  name: pipe(mPipe(call("name"), Str.read, pass(NoEmptyString.is))),
  type: pipe(mPipe(call("type"), Str.read, pass(NoEmptyString.is)))
});

export const toElementModel: ToElementModel<Value> = (v) => ({
  name: v?.name ?? null,
  type: v?.type ?? null
});
