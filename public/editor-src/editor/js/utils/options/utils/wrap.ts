import { FromElementModelGetter } from "visual/component/Options/Type";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { bindPopulation } from "visual/utils/options/utils/bindPopulation";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";

export function wrapOption(t: ToolbarItemType): ToolbarItemType {
  return bindPopulation(t);
}

export const callGetter =
  (s: string) =>
  (g: FromElementModelGetter): MValue<Literal> =>
    g(s);
