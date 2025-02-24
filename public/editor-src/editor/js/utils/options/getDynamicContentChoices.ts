import { Obj } from "@brizy/readers";
import { flatten } from "es-toolkit";
import {
  ConfigDCItem,
  DCGroup
} from "visual/global/Config/types/DynamicContent";
import { MValue } from "visual/utils/value";
import { Literal } from "../types/Literal";
import { TypeChoices } from "./types";

type Options = DCGroup<"wp"> | DCGroup<"cloud">;

const isCloudDynamicContent = (options: Options): options is DCGroup<"cloud"> =>
  "reference" in options && "multiReference" in options;

export interface Choice {
  title: string;
  value: string;
  alias?: string;
  attr: Record<string, Literal>;
  icon?: string;
  display?: "block" | "inline";
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
    value: option.placeholder,
    alias: option.alias,
    attr: option.attr ?? {},
    display: option.display
  };
};

export const optionsToChoices = <T extends keyof Options>(
  options: Options[T]
): (Choice | OptGroup)[] => {
  return flatten(Object.values(options), 1).map(configDCItemToChoices);
};

export const getDynamicContentChoices = (
  options: DCGroup<"wp"> | DCGroup<"cloud">,
  type: TypeChoices
): MValue<(Choice | OptGroup)[]> => {
  const item = options?.[type];

  if (!options || !item || typeof item === "function") {
    return undefined;
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

export const isChoice = (v: unknown): v is Choice =>
  Obj.isObject(v) && !Array.isArray(v) && Obj.hasKeys(["title", "value"], v);
