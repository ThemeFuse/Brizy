import {
  GenericToolbarItemType,
  OptionDefinition,
  ToolbarItemType
} from "visual/editorComponents/ToolbarItemType";
import { filter } from "visual/utils/options/filter";
import { reduce } from "visual/utils/options/reduce";
import { DESKTOP, ResponsiveMode } from "visual/utils/responsiveMode";
import * as State from "visual/utils/stateMode/index";

/**
 * Check if the item or it's inner items supports 2 or more state modes.
 * Exception are the popover and tabs items, because the state mode option is painted inside them
 */
const hasStates = (item: ToolbarItemType): boolean => {
  const _item = filter(
    (o) => !["tabs", "legacy-popover", "popover"].includes(o.type),
    item
  );

  return _item
    ? reduce(
        (acc, item) => acc || (item.states?.length ?? 0) > 1,
        false as boolean,
        _item
      )
    : false;
};

export const bindStateToOption = <T extends OptionDefinition | ToolbarItemType>(
  states: State.State[],
  option: T,
  device: ResponsiveMode
): T => {
  if (option.id === "tabsState") {
    return option;
  }

  let statesList = states;
  if (device !== DESKTOP) {
    statesList = states.filter((it) => it !== "hover");
  }

  switch (option.type) {
    // @ts-expect-error, need to support old popover
    case "legacy-popover":
    case "popover": {
      const options = (option as GenericToolbarItemType<"popover">).options;
      return {
        ...option,
        options: options?.some(hasStates)
          ? [
              {
                id: "tabsState",
                type: "stateMode",
                states: statesList,
                options: (option as GenericToolbarItemType<"popover">).options
              }
            ]
          : options
      };
    }
    case "tabs":
      return {
        ...option,
        tabs: (option as GenericToolbarItemType<"tabs">).tabs?.map((tab) => ({
          ...tab,
          options: tab.options?.some(hasStates)
            ? [
                {
                  id: "tabsState",
                  type: "stateMode",
                  states: statesList,
                  options: tab.options
                }
              ]
            : tab.options
        }))
      };
    default:
      return option;
  }
};
