import { Config } from "visual/component/Options/types/common/Population/Population";
import { keyToDCFallback2Key } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import { inDevelopment } from "visual/editorComponents/EditorComponent/utils";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";
import { findDeep } from "visual/utils/object";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";
import { Choices, OptGroup } from "./types/Choices";
import {
  PopulationMethod,
  PopulationOptgroupMethod
} from "./types/PopulationMethod";
import { Value } from "./types/Value";

/**
 * Check if population feature is enabled
 */

export const bindPopulation = (option: ToolbarItemType): ToolbarItemType => {
  const { population, label, icon, helper, position, ...o } = option;

  if (population === undefined || !inDevelopment(o.type)) {
    return option;
  }

  return {
    id: o.id,
    label,
    icon,
    disabled: o.disabled,
    display: o.display,
    devices: o.devices,
    states: o.states,
    helper,
    position,
    className: o.className,
    type: "population",
    config: population,
    option: o,
    fallback: {
      ...o,
      id: keyToDCFallback2Key(o.id)
    }
  };
};

export const isOptgroup = <T extends Literal>(
  choice: Choices<T> | OptGroup<T>
): choice is OptGroup<T> => "optgroup" in choice;

export const parsePopulation = (v: Value | undefined): Value => {
  if (v === undefined) {
    return {
      population: undefined,
      populationEntityType: undefined,
      populationEntityId: undefined
    };
  }

  const { population, populationEntityType, populationEntityId } = v;

  return {
    population: population,
    populationEntityType: populationEntityType ?? "",
    populationEntityId: populationEntityId ?? ""
  };
};

export const clickOutsideExceptions = [".brz-control__select-current__icon"];

interface FindChoice<T extends Literal> {
  choices: Array<Choices<T> | OptGroup<T>>;
  placeholder: string;
}

export const findDCChoiceByPlaceholder = <T extends Literal>(
  data: FindChoice<T>
): MValue<PopulationMethod> => {
  const { choices, placeholder } = data;

  return (
    findDeep(
      choices,
      (option: PopulationMethod | PopulationOptgroupMethod): boolean => {
        if (isOptgroup(option)) {
          return false;
        }

        if (placeholder === option.alias) {
          return true;
        }

        return placeholder === option.value;
      }
    ).obj ?? undefined
  );
};

export const configChoicesToSelectItemChoices = (
  config: Config,
  choices: Array<PopulationMethod | PopulationOptgroupMethod>
): Array<PopulationMethod | PopulationOptgroupMethod> => {
  const { mockValue = true, iconOnly } = config;

  return [
    ...(mockValue && !iconOnly
      ? [
          {
            title: t("None"),
            value: "",
            attr: {}
          }
        ]
      : []),
    ...(iconOnly
      ? [
          {
            title: t("Custom Text"),
            value: "",
            attr: {}
          }
        ]
      : []),
    ...choices
  ];
};
