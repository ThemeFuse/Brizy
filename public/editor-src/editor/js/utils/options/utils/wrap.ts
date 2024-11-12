import {
  FromElementModelGetter,
  FromElementModelGetterValue
} from "visual/component/Options/Type";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { bindPopulation } from "visual/utils/options/utils/bindPopulation";

export function wrapOption(t: ToolbarItemType): ToolbarItemType {
  return bindPopulation(t);
}

export const callGetter =
  (s: string) =>
  (g: FromElementModelGetter): FromElementModelGetterValue =>
    g(s);
