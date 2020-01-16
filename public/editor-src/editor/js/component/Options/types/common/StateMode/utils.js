import _ from "underscore";
import { hasState, HOVER, NORMAL } from "visual/utils/stateMode";
import { capitalize } from "visual/utils/string";
import { t } from "visual/utils/i18n";
import { toArray } from "visual/utils/array";

/**
 * Filter options by a specific state
 *
 * Are filtered only first level options and options inside `grid` option
 * because grid option is not considered as container type option like `popover`
 * and `tabs`
 *
 * @param {string} state
 * @param {[object]} options
 * @return {[object]}
 */
export const filterByState = (state, options) => {
  return options.reduce((acc, option) => {
    switch (option.type) {
      case "grid":
        {
          const columns = toArray(option.columns).map(column => {
            return {
              ...column,
              options: filterByState(state, toArray(column.options))
            };
          });
          acc.push({ ...option, columns });
        }
        break;
      default:
        if (hasState(state, option)) {
          acc.push(option);
        }
    }

    return acc;
  }, []);
};

/**
 * Flattens an options array that contains grid container option
 *
 * Are flattened only options inside `grid`.
 *
 * @param {[object]} options
 * @return {[object]}
 */
export const flatten = options => {
  return options.reduce((acc, option) => {
    switch (option.type) {
      case "grid": {
        const columns = toArray(option.columns).map((c = {}) =>
          toArray(c.options)
        );

        acc.push(...flatten(_.flatten(columns)));

        return acc;
      }
      default:
        acc.push(option);
        return acc;
    }
  }, []);
};

/**
 * Returns option state state icon code
 *
 * @param {string} state
 * @return {string}
 */
export const stateIcon = state => {
  switch (state) {
    case NORMAL:
      return "nc-circle";
    case HOVER:
      return "nc-hover";
    default:
      return state;
  }
};

/**
 * Returns option state state title
 *
 * @param {string} state
 * @return {string}
 */
export const stateTitle = state => {
  switch (state) {
    case NORMAL:
      return t("Normal");
    case HOVER:
      return t("Hover");
    default:
      return capitalize(state);
  }
};
