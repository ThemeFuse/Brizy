import { mPipe, or, parse } from "fp-utilities";
import * as Option from "visual/component/Options/Type";
import {
  FromElementModelGetter,
  callGetter
} from "visual/component/Options/Type";
import { WithValue } from "visual/component/Options/types/dev/FileUpload/types/Value";
import * as Str from "visual/utils/string/specs";

export const defaultValue = {
  id: "",
  name: ""
};

export const fromElementModel: Option.FromElementModel<"fileUpload"> = parse<
  FromElementModelGetter,
  WithValue
>({
  id: mPipe(
    callGetter("value"),
    Str.read,
    or(
      (s: string | undefined) => s?.split("|||")[0],
      () => defaultValue.id
    )
  ),
  name: mPipe(
    callGetter("value"),
    Str.read,
    or(
      (s: string | undefined) => s?.split("|||")[1],
      () => defaultValue.name
    )
  )
});

export const toElementModel: Option.ToElementModel<"fileUpload"> = (v) =>
  v ? { value: `${v.id}|||${v.name}` } : { value: "" };
