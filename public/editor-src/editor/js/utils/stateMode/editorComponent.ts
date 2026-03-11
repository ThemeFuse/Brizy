import { GroupBase } from "visual/component/Options/types/dev/Addable/types";
import {
  GenericToolbarItemType,
  OptionDefinition,
  ToolbarItemType
} from "visual/editorComponents/ToolbarItemType";
import { filter } from "visual/utils/options/filter";
import { reduce } from "visual/utils/options/reduce";
import { DESKTOP, ResponsiveMode } from "visual/utils/responsiveMode";
import * as State from "visual/utils/stateMode/index";
import { camelCase } from "visual/utils/string";

type StatesConfig = Record<string, { icon?: string; title?: string }>;

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

/**
 * Collect statesConfig from options that have it
 */
const collectStatesConfig = (
  options: ToolbarItemType[] | undefined
): StatesConfig | undefined => {
  if (!options) {
    return undefined;
  }

  const configs: StatesConfig[] = [];
  for (const option of options) {
    if (option.statesConfig) {
      configs.push(option.statesConfig);
    }
  }

  if (configs.length === 0) {
    return undefined;
  }

  // Merge all configs, later configs override earlier ones
  return configs.reduce((acc, config) => ({ ...acc, ...config }), {});
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
      const statesConfig = collectStatesConfig(options);
      return {
        ...option,
        options: options?.some(hasStates)
          ? [
              {
                id: "tabsState",
                type: "stateMode",
                states: statesList,
                ...(statesConfig && { statesConfig }),
                options: (option as GenericToolbarItemType<"popover">).options
              }
            ]
          : options
      };
    }
    case "tabs":
      return {
        ...option,
        tabs: (option as GenericToolbarItemType<"tabs">).tabs?.map((tab) => {
          const statesConfig = collectStatesConfig(tab.options);
          return {
            ...tab,
            options: tab.options?.some(hasStates)
              ? [
                  {
                    id: "tabsState",
                    type: "stateMode",
                    states: statesList,
                    ...(statesConfig && { statesConfig }),
                    options: tab.options
                  }
                ]
              : tab.options
          };
        })
      };
    case "addable": {
      const {
        id: addableId,
        value,
        shape
      } = option as OptionDefinition<"addable">;

      return {
        ...option,
        optionGroups: value.value.map(({ id: groupId, title }: GroupBase) => ({
          id: groupId,
          title,
          options: shape.map((shape) => ({
            ...shape,
            id: camelCase([addableId, groupId, shape.id])
          }))
        }))
      };
    }

    default:
      return option;
  }
};
