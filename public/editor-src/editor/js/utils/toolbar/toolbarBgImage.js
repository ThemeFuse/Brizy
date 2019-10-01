import { t } from "visual/utils/i18n";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";
import { getDynamicContentChoices } from "visual/utils/options";

export function toolbarBgImage({
  v,
  device,
  state,
  devices = "all",
  disabled = false,
  onChange
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const imageDynamicContentChoices = getDynamicContentChoices("image");

  return {
    id: dvk("bgImage"),
    label: t("Image"),
    type: "imageSetter",
    devices,
    disabled,
    population: {
      show: imageDynamicContentChoices.length > 0,
      choices: imageDynamicContentChoices
    },
    value: {
      width: dvv("bgImageWidth"),
      height: dvv("bgImageHeight"),
      src: dvv("bgImageSrc"),
      x: dvv("bgPositionX"),
      y: dvv("bgPositionY"),
      population: dvv("bgPopulation")
    },
    onChange: ({ width, height, src, x, y, population }, { isChanged }) => {
      const values = {
        ...{ v, device, state, onChange },
        ...{ width, height, src, x, y, population, isChanged }
      };

      return saveOnChanges(values);
    }
  };
}

export function toolbarBgImageAttachment({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    id: dvk("bgAttachment"),
    label: t("Parallax"),
    type: "select",
    devices,
    choices: [
      {
        title: t("None"),
        value: "none"
      },
      {
        title: t("Fixed"),
        value: "fixed"
      },
      {
        title: t("Animated"),
        value: "animated"
      }
    ],
    disabled,
    value: dvv("bgAttachment")
  };
}
