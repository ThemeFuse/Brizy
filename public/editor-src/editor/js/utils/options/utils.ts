import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { OptionName } from "visual/component/Options/types";
import { bindPopulation } from "visual/component/Options/types/common/Population/utils";

type T = ToolbarItemType;

export function wrapOption<K extends OptionName>(t: T): T {
  return bindPopulation(t);
}
