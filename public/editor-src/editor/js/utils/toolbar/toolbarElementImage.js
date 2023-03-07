import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentChoices } from "visual/utils/options";

export function toolbarImageLinkExternal({
  v,
  config,
  inGallery,
  device,
  state,
  devices = "all"
}) {
  const dvk = (key) => defaultValueKey({ key, device, state });
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const linkDynamicContentChoices = getDynamicContentChoices(
    config,
    DCTypes.link
  );

  return {
    id: dvk("linkExternal"),
    type: "input",
    label: t("Link to"),
    placeholder: "http://",
    devices,
    population: {
      show: linkDynamicContentChoices.length > 0 && !inGallery,
      choices: linkDynamicContentChoices
    },
    value: {
      population: dvv("linkPopulation"),
      value: dvv("linkExternal")
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

export function toolbarImageTags({ devices = "all", gallery, enableTags }) {
  const { inGallery = false } = gallery || {};

  return {
    label: "Tags",
    id: "tags",
    type: "inputText-dev",
    helper: {
      enabled: true,
      content:
        "Enter the tags, separated by a comma (art, sport, nature, etc).",
      position: "top-end"
    },
    placeholder: "art, nature, etc.",
    devices,
    disabled: !inGallery || !enableTags
  };
}
