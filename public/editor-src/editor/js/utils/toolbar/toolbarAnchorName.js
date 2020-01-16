import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

const helperHTML = `
<span>Add your custom block name, example: my-block </span>`;

export function toolbarAnchorName({
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
    id: dvk("anchorName"),
    label: t("Block Name"),
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
      value: dvv("anchorName"),
      population: dvv("cssIDPopulation")
    },
    onChange: ({ value: anchorName, population }) => ({
      [dvk("anchorName")]: anchorName,
      [dvk("cssIDPopulation")]: population
    })
  };
}
