import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { inDevelopment } from "visual/editorComponents/utils";
import { IS_CMS } from "visual/utils/env";

/**
 * Check if population feature is enabled
 */
export const isEnabled = (): boolean => TARGET === "WP" || IS_CMS;

export const bindPopulationEnabled = (
  option: ToolbarItemType
): ToolbarItemType => {
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

export const bindPopulationDisabled = (
  option: ToolbarItemType
): ToolbarItemType => option;

export const bindPopulation = isEnabled()
  ? bindPopulationEnabled
  : bindPopulationDisabled;
