import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

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
