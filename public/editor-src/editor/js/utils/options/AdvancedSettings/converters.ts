import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";

export const defaultValue = [];

export const fromElementModel: FromElementModel<"advancedSettings"> = () =>
  defaultValue;

export const toElementModel: ToElementModel<"advancedSettings"> = () => ({});
