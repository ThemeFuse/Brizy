import { keyToDCFallback2Key } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import { inDevelopment } from "visual/editorComponents/EditorComponent/utils";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { getVaryAttr } from "visual/utils/dynamicContent";
import { findDeep } from "visual/utils/object";
import * as Str from "visual/utils/reader/string";
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

interface Changes {
  placeholder: string;
  entityType: {
    value: Literal;
  };
  entityId: {
    value: Literal;
  };
  varryAttr: Array<string>;
}

export const handleValuesChange = (data: Changes): MValue<Value> => {
  const { placeholder, entityType, entityId, varryAttr } = data;
  const { showEntityType, showEntityId } = getVaryAttr(varryAttr);
  const _entityType = showEntityType ? entityType.value : "";
  const _entityId = showEntityId ? entityId.value : "";

  if (placeholder) {
    return {
      population: placeholder,
      populationEntityType: Str.read(_entityType) ?? "",
      populationEntityId: _entityId
    };
  }
};

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
