import { t } from "visual/utils/i18n";
import { getDynamicContentChoices } from "visual/utils/options";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarLinkAnchor({
  v,
  device,
  state,
  devices = "all",
  disabled = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("linkAnchor"),
    label: t("Block"),
    type: "blockThumbnail",
    devices,
    disabled,
    value: dvv("linkAnchor")
  };
}

export function toolbarLinkUpload({
  v,
  device,
  state,
  disabled = false,
  devices = "all"
}) {
  return {
    id: defaultValueKey({ key: "linkUpload", device, state }),
    label: t("File"),
    type: "fileUpload",
    disabled,
    devices,
    value: defaultValueValue({ v, key: "linkUpload", device, state })
  };
}

export function toolbarLinkExternal({ v, devices = "all" }) {
  const linkDynamicContentChoices = getDynamicContentChoices("link");

  return {
    id: "linkExternal",
    type: "input",
    devices,
    label: t("Link to"),
    placeholder: "http://",
    population: {
      show: linkDynamicContentChoices.length > 0,
      choices: linkDynamicContentChoices
    },
    value: {
      value: v.linkExternal,

      population: v.linkPopulation
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

export function toolbarLinkExternalBlank({
  v,
  device,
  state,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("linkExternalBlank"),
    type: "switch",
    label: t("Open In New Tab"),
    devices,
    value: dvv("linkExternalBlank")
  };
}

export function toolbarLinkExternalRel({ v, device, state, devices = "all" }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("linkExternalRel"),
    type: "switch",
    label: t("Make it Nofollow"),
    devices,
    value: dvv("linkExternalRel")
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
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

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
