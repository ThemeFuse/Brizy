/**
 * Check if population feature is enabled
 */
import { keyToDCFallback2Key } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import { inDevelopment } from "visual/editorComponents/EditorComponent/utils";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";

export const bindPopulation = (
  option: ToolbarItemType,
  parentOption?: ToolbarItemType
): ToolbarItemType => {
  const { population, label, icon, helper, position, ...o } = option;

  if (
    population === undefined ||
    !inDevelopment(o.type) ||
    parentOption?.type === "addable"
  ) {
    return option;
  }

  return {
    id: o.id,
    label,
    icon,
    disabled: o.disabled,
    display: o.display,
    devices: o.devices,
    states: o.states,
    helper,
    position,
    className: o.className,
    type: "population",
    config: population,
    option: o,
    fallback: {
      ...o,
      id: keyToDCFallback2Key(o.id)
    }
  };
};
