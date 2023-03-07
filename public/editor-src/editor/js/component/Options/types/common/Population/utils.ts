import { keyToDCFallback2Key } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import { inDevelopment } from "visual/editorComponents/EditorComponent/utils";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { Choices, OptGroup } from "./types/Choices";

/**
 * Check if population feature is enabled
 */

export const bindPopulation = (option: ToolbarItemType): ToolbarItemType => {
  const { population, label, icon, helper, position, ...o } = option;

  if (population === undefined || !inDevelopment(o.type)) {
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
    type: "population-dev",
    config: {
      choices: population
    },
    option: o,
    fallback: {
      ...o,
      id: keyToDCFallback2Key(o.id)
    }
  };
};

export const isOptgroup = <T extends string | number>(
  choice: Choices<T> | OptGroup<T>
): choice is OptGroup<T> => "optgroup" in choice;
