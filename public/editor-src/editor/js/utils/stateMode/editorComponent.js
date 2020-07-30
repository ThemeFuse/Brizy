import * as State from "visual/utils/stateMode/index";
import { onEmpty, toArray } from "visual/utils/array";

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
    case "tabs-dev":
      return {
        ...option,
        tabs: toArray(option.tabs).map(tab => ({
          ...tab,
          options: [
            {
              id: "tabsState",
              type: "stateMode",
              options: tab.options ?? [],
              value: State.mRead(state),
              onChange
            }
          ]
        }))
      };

    case "popover":
    case "popover-dev":
      return {
        ...option,
        options: [
          {
            id: "tabsState",
            type: "stateMode",
            options: option.options ?? [],
            value: State.mRead(state),
            onChange
          }
        ]
      };

    default:
      return option;
  }
};

/**
 * Check if option supports specific state mode
 *  - By default every option supports defaultState()
 *    if the `states` key is not defined or empty
 *
 * @param {StateMode} s
 * @param {{states: StateMode[]}} o
 * @return {boolean}
 */
export const hasState = (s, o) => onEmpty([State.empty], o.states).includes(s);

/**
 * Check if at least on option supports specific mode
 *
 * @param {StateMode} s state mode
 * @param {{states: StateMode[]}[]} opts options
 * @return {boolean}
 */
export const haveState = (s, opts) => opts.some(hasState.bind(null, s));
