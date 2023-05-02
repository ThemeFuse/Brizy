import _ from "underscore";
import {
  ConfigDCItem,
  DCGroup
} from "visual/global/Config/types/DynamicContent";
import { TypeChoices } from "./types";

type Options = DCGroup<"wp"> | DCGroup<"cloud">;

const isCloudDynamicContent = (options: Options): options is DCGroup<"cloud"> =>
  "reference" in options && "multiReference" in options;

export interface Choice {
  title: string;
  value: string;
  icon?: string;
}

export interface OptGroup {
  title: string;
  optgroup: (Choice | OptGroup)[];
  icon?: string;
}

const isOptionOptGroup = (
  option: ConfigDCItem
): option is Required<ConfigDCItem> => {
  return "optgroup" in option;
};

const configDCItemToChoices = (option: ConfigDCItem): Choice | OptGroup => {
  if (isOptionOptGroup(option)) {
    return {
      title: option.label,
      optgroup: option.optgroup.map(configDCItemToChoices)
    };
  }

  // `alias` was added for interop reasons between WP and cloud
  // e.g. cloud does not have a separate placeholder for excerpt ( {{brizy_dc_post_excerpt}} )
  // but PostExcerpt element sets it, and this kind of issues were solved with `alias` key
  return {
    title: option.label,
    value: option.alias || option.placeholder
  };
};

const optionsToChoices = <T extends keyof Options>(
  options: Options[T]
): (Choice | OptGroup)[] => {
  return _.flatten(_.values(options), true).map(configDCItemToChoices);
};

export const getDynamicContentChoices = (
  options: DCGroup<"wp"> | DCGroup<"cloud">,
  type: TypeChoices
): (Choice | OptGroup)[] => {
  const item = options?.[type];

  if (!options || !item || typeof item === "function") {
    return [];
  }

  const choices = optionsToChoices(item);

  const choicesReference: OptGroup[] = [];

  if (isCloudDynamicContent(options)) {
    // extract all options inclusive reference & multiReference
    const { reference, multiReference } = options;
    const refs = [...(reference ?? []), ...(multiReference ?? [])];

    refs.forEach(({ title, dynamicContent }) => {
      if (Array.isArray(dynamicContent[type])) {
        const optgroup = optionsToChoices(dynamicContent[type]);

        if (optgroup.length) {
          choicesReference.push({ optgroup, title });
        }
      }
    });
  }

  return [...choices, ...choicesReference];
};
