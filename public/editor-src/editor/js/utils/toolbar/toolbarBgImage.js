import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { t } from "visual/utils/i18n";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";

export function toolbarBgImage({
  v,
  device,
  state,
  states,
  devices = "all",
  disabled = false,
  config,
  onChange
}) {
  const dvk = (key) => defaultValueKey({ key, device, state });
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const imageDynamicContentChoices = getDynamicContentOption({
    options: config,
    type: DCTypes.image
  });

  return {
    id: dvk("bgImage"),
    label: t("Image"),
    type: "imageSetter",
    devices,
    states,
    disabled,
    population: imageDynamicContentChoices,
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
