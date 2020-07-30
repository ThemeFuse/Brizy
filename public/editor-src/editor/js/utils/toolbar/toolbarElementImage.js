import { t } from "visual/utils/i18n";
import { getDynamicContentChoices } from "visual/utils/options";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

import { calcWrapperSizes } from "visual/editorComponents/Image2/utils";

const DEFAULT_IMAGE_SIZES = {
  width: 1440,
  height: 960
};

export function toolbarImageLinkExternal({
  v,
  inGallery,
  device,
  state,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const linkDynamicContentChoices = getDynamicContentChoices("link");

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

export function toolbarImageSetter({
  v,
  cW,
  device,
  state,
  devices = "all",
  disabled = false,
  showPointer = true,
  wrapperSizes,
  dynamicContent,
  gallery
}) {
  const { inGallery = false } = gallery || {};

  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("image"),
    label: t("Image"),
    type: "imageSetter",
    disabled,
    devices,
    onlyPointer: device !== "desktop",
    showPointer,
    population: device === "desktop" && {
      show: dynamicContent.length > 0 && !inGallery,
      choices: dynamicContent
    },
    value: {
      width: v.imageWidth,
      height: v.imageHeight,
      extension: v.imageExtension,
      src: v.imageSrc,
      x: dvv("positionX"),
      y: dvv("positionY"),
      population: v.imagePopulation
    },
    onChange:
      device === "desktop"
        ? ({ width, height, src, x, y, population, extension }) => {
            if (population) {
              return {
                imagePopulation: population
              };
            }

            const imgWidth = width || DEFAULT_IMAGE_SIZES.width;
            const imgHeight = height || DEFAULT_IMAGE_SIZES.height;

            const newWrapperSizes = calcWrapperSizes(
              {
                imageWidth: imgWidth,
                imageHeight: imgHeight,
                widthSuffix: v.widthSuffix,
                heightSuffix: v.heightSuffix,
                width: v.width,
                height: v.height
              },
              cW
            );

            let newCW = wrapperSizes.width;
            let newCH = wrapperSizes.height;

            if (v.widthSuffix === "%") {
              const w = v.width || 100;
              newCW = (wrapperSizes.width * w) / newWrapperSizes.width;
            }

            if (v.heightSuffix === "%") {
              const h = v.height || 100;
              newCH = (wrapperSizes.height * h) / newWrapperSizes.height;
            }

            // Conditions for SVG & GIF
            if (extension === "svg" || extension === "gif") {
              const originalCH = wrapperSizes.width / (imgWidth / imgHeight);
              newCH = v.heightSuffix === "px" ? originalCH : 100;
            }

            return {
              imageWidth: imgWidth,
              imageHeight: imgHeight,
              imageSrc: src,
              imageExtension: extension,
              width: Math.round(newCW),
              height: Math.round(newCH),
              positionX: x,
              positionY: y,
              imagePopulation: ""
            };
          }
        : ({ x, y }) => {
            return {
              [dvk("positionX")]: x,
              [dvk("positionY")]: y
            };
          }
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
