import { mPipe, optional, orElse, parse, pass } from "fp-utilities";
import {
  FromElementModel,
  FromElementModelGetter,
  ToElementModel
} from "visual/component/Options/Type";
import {
  Value,
  WithValue
} from "visual/component/Options/types/dev/IconSetter/types/Value";
import { pipe } from "visual/utils/fp";
import { call } from "visual/utils/options/Animation/utils";
import * as NoEmptyString from "visual/utils/string/NoEmptyString";
import * as Str from "visual/utils/string/specs";

export const defaultValue: Value = {
  name: "",
  type: "",
  filename: ""
};

export const fromElementModel: FromElementModel<"iconSetter"> = parse<
  FromElementModelGetter,
  WithValue
>({
  name: pipe(
    mPipe(call("name"), Str.read, pass(NoEmptyString.is)),
    orElse(defaultValue.name)
  ),
  type: pipe(
    mPipe(call("type"), Str.read, pass(NoEmptyString.is)),
    orElse(defaultValue.type)
  ),
  filename: optional(
    pipe(
      mPipe(call("filename"), Str.read, pass(NoEmptyString.is)),
      orElse(defaultValue.filename)
    )
  )
});

export const toElementModel: ToElementModel<"iconSetter"> = (v) => ({
  name: v?.name ?? null,
  type: v?.type ?? null,
  filename: v?.filename ?? null
});
