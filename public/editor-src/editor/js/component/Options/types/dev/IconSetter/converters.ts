import { mPipe, parse, pass } from "fp-utilities";
import {
  FromElementModel,
  FromElementModelGetter,
  ToElementModel
} from "visual/component/Options/Type";
import { call } from "visual/component/Options/types/dev/Animation/utils";
import {
  Value,
  WithValue
} from "visual/component/Options/types/dev/IconSetter/types/Value";
import { pipe } from "visual/utils/fp";
import * as NoEmptyString from "visual/utils/string/NoEmptyString";
import * as Str from "visual/utils/string/specs";

export const fromElementModel: FromElementModel<"iconSetter"> = parse<
  FromElementModelGetter,
  WithValue
>({
  name: pipe(mPipe(call("name"), Str.read, pass(NoEmptyString.is))),
  type: pipe(mPipe(call("type"), Str.read, pass(NoEmptyString.is)))
});

export const toElementModel: ToElementModel<"iconSetter"> = (v) => ({
  name: v?.name ?? null,
  type: v?.type ?? null
});

export const defaultValue: Value = undefined;
