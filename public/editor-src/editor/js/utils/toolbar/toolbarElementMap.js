import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentChoices } from "visual/utils/options";

export function toolbarElementMapAddress({
  v,
  device,
  devices = "all",
  state
}) {
  const mapDynamicContentChoices = getDynamicContentChoices("richText");

  return {
    id: defaultValueKey({ key: "address", device, state }),
    label: t("Address"),
    type: "input",
    devices,
    placeholder: t("Enter address"),
    population: {
      show: mapDynamicContentChoices.length > 0,
      choices: mapDynamicContentChoices
    },
    value: {
      value: defaultValueValue({
        v,
        key: "address",
        device,
        state
      }),
      population: defaultValueValue({
        v,
        key: "addressPopulation",
        device,
        state
      })
    },
    onChange: ({ value, population }) => ({
      [defaultValueKey({ v, key: "address", device, state })]: value,
      [defaultValueKey({
        v,
        key: "addressPopulation",
        device,
        state
      })]: population
    })
  };
}

export function toolbarElementMapZoom({ v, device, devices = "all", state }) {
  return {
    id: defaultValueKey({ key: "zoom", device, state }),
    label: t("Zoom"),
    type: "slider",
    devices,
    slider: {
      min: 1,
      max: 21
    },
    input: {
      show: true
    },
    value: {
      value: defaultValueValue({
        v,
        key: "zoom",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "zoom", device, state })]: value
    })
  };
}
