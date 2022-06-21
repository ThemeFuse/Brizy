import * as Option from "visual/component/Options/Type";
import { Value } from "visual/component/Options/types/dev/IconPicker/types";
import * as Str from "visual/utils/string/specs";

export const getModel: Option.FromElementModel<Value> = get =>
  Str.read(get("value"));
export const getElementModel: Option.ToElementModel<Value> = value => ({
  value
});
