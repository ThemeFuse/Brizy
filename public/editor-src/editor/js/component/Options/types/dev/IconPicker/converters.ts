import * as Option from "visual/component/Options/Type";
import { Value } from "visual/component/Options/types/dev/IconPicker/types";
import * as Str from "visual/utils/string/specs";

export const fromElementModel: Option.FromElementModel<"iconPicker-dev"> = get =>
  Str.read(get("value"));
export const toElementModel: Option.ToElementModel<"iconPicker-dev"> = value => ({
  value
});

export const defaultValue: Value = undefined;
