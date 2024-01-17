import { mPipe, parse } from "fp-utilities";
import * as Option from "visual/component/Options/Type";
import {
  FromElementModelGetter,
  callGetter
} from "visual/component/Options/Type";
import { WithValue } from "visual/component/Options/types/dev/FileUpload/types/Value";
import * as Str from "visual/utils/string/specs";

export const defaultValue = undefined;

export const fromElementModel: Option.FromElementModel<"fileUpload"> = parse<
  FromElementModelGetter,
  WithValue
>({
  id: mPipe(callGetter("value"), Str.read, (s) => s.split("|||")[0]),
  name: mPipe(callGetter("value"), Str.read, (s) => s.split("|||")[1])
});

export const toElementModel: Option.ToElementModel<"fileUpload"> = (v) =>
  v ? { value: `${v.id}|||${v.name}` } : { value: "" };
