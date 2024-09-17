import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import { pipe, Str } from "@brizy/readers";
import { onNullish } from "visual/utils/value";

export const defaultValue = {
  value: ""
};

export const fromElementModel: FromElementModel<"blockThumbnail"> = (get) => ({
  value: pipe(Str.read, onNullish(defaultValue.value))(get("value"))
});

export const toElementModel: ToElementModel<"blockThumbnail"> = (value) => ({
  value: value.value
});
