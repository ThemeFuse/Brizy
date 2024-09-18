import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import { Color } from "./types";

export const defaultValue: Color[] = [];

export const fromElementModel: FromElementModel<"colorPaletteEditor"> = () =>
  defaultValue;
export const toElementModel: ToElementModel<"colorPaletteEditor"> = () => ({});
