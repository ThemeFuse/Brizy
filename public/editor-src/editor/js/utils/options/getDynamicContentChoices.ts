import _ from "underscore";
import { DynamicContent } from "visual/global/Config/types/DynamicContent";
import { TypeChoices } from "./types";

type Options = DynamicContent<"wp"> | DynamicContent<"cloud">;

export interface Choice {
  title: string;
  value: string;
  icon?: string;
}

export interface OptGroup {
  title: string;
  optgroup: Choice[];
  icon?: string;
}

const optionsToChoices = <T extends keyof Options>(
  options: Options[T]
): Choice[] => {
  return _.flatten(_.values(options), true).map(
    ({ label, placeholder, alias }) => ({
      title: label,

      // `alias` was added for interop reasons between WP and cloud
      // e.g. cloud does not have a separate placeholder for excerpt ( {{brizy_dc_post_excerpt}} )
      // but PostExcerpt element sets it, and this kind of issues were solved with `alias` key
      value: alias || placeholder
    })
  );
};

export const getDynamicContentChoices = (
  // take a look later. This fn is using reference & multiReference
  // which are available only in DynamicContent<"cloud">
  options: DynamicContent<"cloud">,
  type: TypeChoices
): (Choice | OptGroup)[] => {
  if (!options) {
    return [];
  }
  const choices = optionsToChoices(options[type]);
  const choicesReference: OptGroup[] = [];

  // extract all options inclusive reference & multiReference
  const { reference, multiReference } = options;
  const refs = [...(reference ?? []), ...(multiReference ?? [])];

  refs.forEach(({ title, dynamicContent }) => {
    const optgroup = optionsToChoices(dynamicContent[type]);

    if (optgroup.length) {
      choicesReference.push({ optgroup, title });
    }
  });

  return [...choices, ...choicesReference];
};
