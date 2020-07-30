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
  states,
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
    states,
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
      extension: dvv("bgImageExtension"),
      population: dvv("bgPopulation")
    },
    onChange: (
      { width, height, src, x, y, population, extension },
      { isChanged }
    ) => {
      const values = {
        ...{ v, device, state, onChange },
        ...{ width, height, src, x, y, population, extension, isChanged }
      };

      return saveOnChanges(values);
    }
  };
}
