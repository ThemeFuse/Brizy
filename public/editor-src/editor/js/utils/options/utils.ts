import { bindPopulation } from "visual/component/Options/types/common/Population/utils";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";

export function wrapOption(t: ToolbarItemType): ToolbarItemType {
  return bindPopulation(t);
}
