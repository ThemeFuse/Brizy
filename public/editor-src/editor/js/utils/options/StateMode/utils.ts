import { uniq } from "es-toolkit";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";
import { filter } from "visual/utils/options/filter";
import { reduceR } from "visual/utils/options/reduce";
import * as State from "visual/utils/stateMode";

export const itemStates = (item: ToolbarItemType): State.State[] => {
  const states = reduceR(
    (acc: State.State[], item) => [...acc, ...(item.states ?? [])],
    [],
    item
  );
  return states.length ? uniq(states) : ["normal"];
};

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
export const filterByState = (
  state: State.State,
  options: ToolbarItemType
): ToolbarItemType | undefined =>
  filter((item) => itemStates(item).includes(state), options);

/**
 * Returns option state state icon code
 *
 * @param {StateMode} state
 * @return {string}
 */
export const stateIcon = (state: State.State): string => {
  switch (state) {
    case "normal":
      return "nc-circle";
    case "hover":
      return "nc-hover";
    case "active":
      return "nc-target";
  }
};

/**
 * Returns option state state title
 *
 * @param {StateMode} state
 * @return {string}
 */
export const stateTitle = (state: State.State): string => {
  switch (state) {
    case "normal":
      return t("Normal");
    case "hover":
      return t("Hover");
    case "active":
      return t("Active");
  }
};
