import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementStarRatingLabel({
  v,
  device,
  state,
  devices = "desktop"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("label"),
    label: t("Label"),
    type: "input",
    devices,
    value: {
      value: dvv("label")
    },
    onChange: ({ value }) => ({
      [dvk("label")]: value
    })
  };
}

export function toolbarElementStarRatingRating({
  v,
  device,
  devices = "desktop",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("rating"),
    label: t("Rating"),
    type: "slider",
    roles: ["admin"],
    devices,
    slider: {
      min: 0,
      max: 5,
      step: 0.1
    },
    input: {
      show: true,
      min: 0,
      max: 5,
      step: 0.1
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "/5",
          value: "/5"
        }
      ]
    },
    value: {
      value: dvv("rating")
    },
    onChange: ({ value: rating }) => {
      return {
        [dvk("rating")]: rating
      };
    }
  };
}
