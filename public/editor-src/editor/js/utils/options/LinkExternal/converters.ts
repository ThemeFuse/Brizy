import { pipe, Str } from "@brizy/readers";
import type {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import { onNullish } from "visual/utils/value";

export const defaultValue = {
  value: ""
};

export const fromElementModel: FromElementModel<"linkExternal"> = (get) => ({
  value: pipe(Str.read, onNullish(defaultValue.value))(get("value"))
});

export const toElementModel: ToElementModel<"linkExternal"> = (value) => ({
  value: value.value
});
