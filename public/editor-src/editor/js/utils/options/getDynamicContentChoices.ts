import _ from "underscore";
import {
  ConfigDCItem,
  DynamicContent
} from "visual/global/Config/types/DynamicContent";
import { TypeChoices } from "./types";

type Options = DynamicContent<"wp"> | DynamicContent<"cloud">;

const isCloudDynamicContent = (
  options: Options
): options is DynamicContent<"cloud"> =>
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
  options: DynamicContent<"wp"> | DynamicContent<"cloud">,
  type: TypeChoices
): (Choice | OptGroup)[] => {
  if (!options) {
    return [];
  }
  const choices = optionsToChoices(options[type]);

  const choicesReference: OptGroup[] = [];

  if (isCloudDynamicContent(options)) {
    // extract all options inclusive reference & multiReference
    const { reference, multiReference } = options;
    const refs = [...(reference ?? []), ...(multiReference ?? [])];

    refs.forEach(({ title, dynamicContent }) => {
      const optgroup = optionsToChoices(dynamicContent[type]);

      if (optgroup.length) {
        choicesReference.push({ optgroup, title });
      }
    });
  }

  return [...choices, ...choicesReference];
};
