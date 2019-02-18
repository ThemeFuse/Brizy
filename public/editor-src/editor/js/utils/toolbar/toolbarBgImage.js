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
  disabled = false,
  onChange
}) {
  const imageDynamicContentChoices = getDynamicContentChoices("image");
  const bgImageKey = defaultValueKey({ key: "bgImage", device, state });
  const bgImageWidthValue = defaultValueValue({
    v,
    key: "bgImageWidth",
    device,
    state
  });
  const bgImageHeightValue = defaultValueValue({
    v,
    key: "bgImageHeight",
    device,
    state
  });
  const bgImageSrcValue = defaultValueValue({
    v,
    key: "bgImageSrc",
    device,
    state
  });
  const bgPositionXValue = defaultValueValue({
    v,
    key: "bgPositionX",
    device,
    state
  });
  const bgPositionYValue = defaultValueValue({
    v,
    key: "bgPositionY",
    device,
    state
  });
  const bgPopulationValue = defaultValueValue({
    v,
    key: "bgPopulation",
    device,
    state
  });

  return {
    id: bgImageKey,
    label: t("Image"),
    type: "imageSetter",
    disabled,
    population: {
      show: imageDynamicContentChoices.length > 0,
      choices: imageDynamicContentChoices
    },
    value: {
      width: bgImageWidthValue,
      height: bgImageHeightValue,
      src: bgImageSrcValue,
      x: bgPositionXValue,
      y: bgPositionYValue,
      population: bgPopulationValue
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

export function toolbarBgImageAttachment({ v, disabled = false }) {
  return {
    id: "bgAttachment",
    label: t("Parallax"),
    type: "select",
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
    value: v.bgAttachment
  };
}
