import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { inDevelopment } from "visual/editorComponents/EditorComponent/utils";
import { Choices, OptGroup } from "./types/Choices";

/**
 * Check if population feature is enabled
 */

export const bindPopulation = (option: ToolbarItemType): ToolbarItemType => {
  const {
    population,
    label,
    icon,
    disabled,
    display,
    states,
    devices,
    helper,
    position,
    ...o
  } = option;

  if (population === undefined || !inDevelopment(o.type)) {
    return option;
  }

  return {
    id: o.id,
    label,
    icon,
    disabled,
    display,
    states,
    devices,
    helper,
    position,
    className: o.className,
    type: "population-dev",
    config: {
      choices: population
    },
    options: [o]
  };
};

export const isOptgroup = <T extends string | number>(
  choice: Choices<T> | OptGroup<T>
): choice is OptGroup<T> => "optgroup" in choice;
