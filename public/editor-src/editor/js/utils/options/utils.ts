import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { bindPopulation } from "visual/component/Options/types/common/Population/utils";

export function wrapOption(t: ToolbarItemType): ToolbarItemType {
  return bindPopulation(t);
}
