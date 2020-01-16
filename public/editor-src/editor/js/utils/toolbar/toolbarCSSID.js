import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

const helperHTML = `
<span>Add your custom ID without the #pound, example: my-id</span>`;

export function toolbarCSSID({
  v,
  device,
  devices = "all",
  position = 30,
  state,
  population
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    id: dvk("customID"),
    label: t("CSS ID"),
    type: "input",
    display: "block",
    position,
    devices,
    helper: true,
    helperContent: helperHTML,
    population: {
      show: population.length > 0,
      choices: population
    },
    value: {
      value: dvv("customID"),
      population: dvv("cssIDPopulation")
    },
    onChange: ({ value, population }) => ({
      [dvk("customID")]: value,
      [dvk("cssIDPopulation")]: population
    })
  };
}
