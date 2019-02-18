import { t } from "visual/utils/i18n";
import { getDynamicContentChoices } from "visual/utils/options";

export function toolbarImageLinkExternal({ v, inGallery }) {
  const linkDynamicContentChoices = getDynamicContentChoices("link");

  return {
    id: "linkExternal",
    type: "input",
    label: t("Link to"),
    placeholder: "http://",
    population: {
      show: linkDynamicContentChoices.length > 0 && !inGallery,
      choices: linkDynamicContentChoices
    },
    value: {
      population: v.linkPopulation,
      value: v.linkExternal
    },
    onChange: (
      { value: linkExternal, population: linkPopulation },
      { changed }
    ) => {
      return {
        linkExternal,
        linkPopulation,
        linkExternalType:
          changed === "value" || linkPopulation === ""
            ? "linkExternal"
            : "linkPopulation"
      };
    }
  };
}
