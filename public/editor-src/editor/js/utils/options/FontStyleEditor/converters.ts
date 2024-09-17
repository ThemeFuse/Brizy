import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";

export const defaultValue = [];

export const fromElementModel: FromElementModel<"fontStyleEditor"> = () =>
  defaultValue;

export const toElementModel: ToElementModel<"fontStyleEditor"> = () => ({});
