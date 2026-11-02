import type {
  FromElementModelGetter,
  FromElementModelGetterValue
} from "visual/component/Options/Type";
import type { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { bindPopulation } from "visual/utils/options/utils/bindPopulation";

export function wrapOption(
  option: ToolbarItemType,
  parentOption?: ToolbarItemType
): ToolbarItemType {
  return bindPopulation(option, parentOption);
}

export const callGetter =
  (s: string) =>
  (g: FromElementModelGetter): FromElementModelGetterValue =>
    g(s);
