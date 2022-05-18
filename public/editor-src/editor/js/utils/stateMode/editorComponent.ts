import * as State from "visual/utils/stateMode/index";
import {
  GenericToolbarItemType,
  ToolbarItemType
} from "visual/editorComponents/ToolbarItemType";
import { filter } from "visual/component/Options/types/utils/filter";
import { reduce } from "visual/component/Options/types/utils/reduce";

/**
 * Check if the item or it's inner items supports 2 or more state modes.
 * Exception are the popover and tabs items, because the state mode option is painted inside them
 */
const hasStates = (item: ToolbarItemType): boolean => {
  const _item = filter(
    o => !["tabs", "tabs-dev", "popover", "popover-dev"].includes(o.type),
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

export const bindStateToOption = <T extends ToolbarItemType>(
  states: State.State[],
  option: T
): T => {
  if (option.id === "tabsState") {
    return option;
  }

  switch (option.type) {
    // @ts-expect-error, need to support old popover
    case "popover":
    case "popover-dev": {
      const options = (option as GenericToolbarItemType<"popover-dev">).options;
      return {
        ...option,
        options: options?.some(hasStates)
          ? [
              {
                id: "tabsState",
                type: "stateMode-dev",
                states,
                options: (option as GenericToolbarItemType<"popover-dev">)
                  .options
              }
            ]
          : options
      };
    }
    // @ts-expect-error, need to support old tabs
    case "tabs":
    case "tabs-dev":
      return {
        ...option,
        tabs: (option as GenericToolbarItemType<"tabs-dev">).tabs?.map(tab => ({
          ...tab,
          options: tab.options?.some(hasStates)
            ? [
                {
                  id: "tabsState",
                  type: "stateMode-dev",
                  states,
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
