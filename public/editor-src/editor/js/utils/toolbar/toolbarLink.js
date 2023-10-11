import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";

export function toolbarLinkAnchor({
  v,
  device,
  state,
  devices = "all",
  disabled = false
}) {
  const dvk = (key) => defaultValueKey({ key, device, state });
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("linkAnchor"),
    label: t("Block"),
    type: "blockThumbnail",
    devices,
    disabled,
    value: dvv("linkAnchor")
  };
}

export function toolbarStoryAnchor({ disabled = false, devices = "all" }) {
  return {
    id: "linkToSlide",
    type: "number-dev",
    label: t("Slide"),
    disabled,
    devices,
    config: {
      min: 1,
      max: 1000000
    }
  };
}

export function toolbarLinkExternal({ v, config, devices = "all" }) {
  const population = getDynamicContentOption({
    options: config,
    type: DCTypes.link,
    config: { show: true }
  });

  return {
    id: "linkExternal",
    type: "input",
    devices,
    label: t("Link to"),
    placeholder: "http://",
    population: population,
    value: {
      value: v.linkExternal,
      population: {
        population: v.linkPopulation,
        populationEntityType: v.linkPopulationEntityType,
        populationEntityId: v.linkPopulationEntityId
      }
    },
    onChange: ({ value: linkExternal, population }, { changed }) => {
      const linkPopulation = population.population;

      return {
        linkExternal,
        linkPopulation,
        linkPopulationEntityId: population.populationEntityId,
        linkPopulationEntityType: population.populationEntityType,
        linkExternalType:
          changed === "value" || linkPopulation === ""
            ? "linkExternal"
            : "linkPopulation"
      };
    }
  };
}

export function toolbarLinkPopup({
  v,
  device,
  state,
  canDelete = true,
  disabled = false,
  component,
  devices = "all"
}) {
  const dvk = (key) => defaultValueKey({ key, device, state });
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("linkPopup"),
    type: "promptAddPopup",
    label: t("Popup"),
    canDelete,
    disabled,
    popupKey: `${component.getId()}_${dvv("linkPopup")}`,
    devices,
    value: {
      value: dvv("linkPopup"),
      popups: dvv("popups")
    },
    onChange: ({ value, popups }) => ({
      [dvk("linkPopup")]: value,
      [dvk("popups")]: popups
    })
  };
}
