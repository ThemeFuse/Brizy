import { OptionName } from "visual/component/Options/types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { inDevelopment } from "visual/editorComponents/utils";

/**
 * Check if population feature is enabled
 */
export const isEnabled = (): boolean => TARGET === "WP";

export function bindPopulation<K extends OptionName>(
  option: ToolbarItemType
): ToolbarItemType {
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
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  if (!isEnabled() || population === undefined || !inDevelopment(o.type)) {
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
}
