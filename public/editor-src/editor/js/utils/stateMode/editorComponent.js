import { valueToState } from "visual/utils/stateMode/index";
import { toArray } from "visual/utils/array";

/**
 *
 * @param state
 * @param onChange
 * @param option
 * @return {object}
 */
export const bindStateToOption = (state, onChange, option) => {
  const { id, type } = option || {};

  if (id === "tabsState") {
    return option;
  }

  switch (type) {
    case "tabs":
      return {
        ...option,
        tabs: toArray(option.tabs).map(tab => ({
          ...tab,
          options: [
            {
              id: "tabsState",
              type: "stateMode",
              options: tab.options,
              value: valueToState(state),
              onChange
            }
          ]
        }))
      };

    case "popover":
      return {
        ...option,
        options: [
          {
            id: "tabsState",
            type: "stateMode",
            options: option.options,
            value: valueToState(state),
            onChange
          }
        ]
      };

    default:
      return option;
  }
};
