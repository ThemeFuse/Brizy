import { t } from "visual/utils/i18n";
import { getDynamicContentChoices } from "visual/utils/options";

export function toolbarLinkAnchor({ v }) {
  return {
    id: "linkAnchor",
    label: t("Anchor"),
    type: "blockThumbnail",
    value: v.linkAnchor
  };
}

export function toolbarLinkExternal({ v }) {
  const linkDynamicContentChoices = getDynamicContentChoices("link");

  return {
    id: "linkExternal",
    type: "input",
    label: t("Link to"),
    placeholder: "http://",
    population: {
      show: linkDynamicContentChoices.length > 0,
      choices: linkDynamicContentChoices
    },
    value: {
      value: v.linkExternal,
      population: v.linkPopulation
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

export function toolbarLinkExternalBlank({ v }) {
  return {
    id: "linkExternalBlank",
    type: "switch",
    label: t("Open In New Tab"),
    value: v.linkExternalBlank
  };
}

export function toolbarLinkExternalRel({ v }) {
  return {
    id: "linkExternalRel",
    type: "switch",
    label: t("Make it Nofollow"),
    value: v.linkExternalRel
  };
}
