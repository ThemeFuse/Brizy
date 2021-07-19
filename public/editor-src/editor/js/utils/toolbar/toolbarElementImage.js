import { t } from "visual/utils/i18n";
import { getDynamicContentChoices } from "visual/utils/options";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { DCTypes } from "visual/global/Config/types/DynamicContent";

export function toolbarImageLinkExternal({
  v,
  config,
  inGallery,
  device,
  state,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

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

export function toolbarImageBorderRadius({
  v,
  device,
  state,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    type: "multiPicker",
    devices,
    picker: {
      id: dvk("borderRadiusType"),
      label: t("Corner"),
      type: "radioGroup",
      choices: [
        {
          value: "square",
          icon: "nc-corners-square"
        },
        {
          value: "rounded",
          icon: "nc-corners-round"
        },
        {
          value: "custom",
          icon: "nc-more"
        }
      ],
      value: dvv("borderRadiusType"),
      onChange: borderRadiusType => ({
        [dvk("borderRadiusType")]: borderRadiusType,

        borderRadius:
          borderRadiusType === "square"
            ? dvv("tempBorderRadius")
            : borderRadiusType === "rounded"
            ? 300
            : dvv("borderRadius")
      })
    },
    choices: {
      custom: [
        {
          id: dvk("borderRadius"),
          type: "slider",
          slider: {
            min: 0,
            max: 300
          },
          input: {
            show: true,
            max: 300
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "px",
                value: "px"
              }
            ]
          },
          value: {
            value: dvv("borderRadius")
          },
          onChange: ({ value: borderRadius }) => ({
            [dvk("borderRadius")]: borderRadius,
            [dvk("tempBorderRadius")]: borderRadius
          })
        }
      ]
    }
  };
}
