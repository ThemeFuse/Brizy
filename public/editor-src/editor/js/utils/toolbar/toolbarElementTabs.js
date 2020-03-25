import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementTabsIconPosition({ v, device, state }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("iconPosition"),
    label: t("Position"),
    type: "radioGroup",
    choices: [
      {
        value: "left",
        icon: "nc-align-left"
      },
      {
        value: "right",
        icon: "nc-align-right"
      }
    ],
    value: dvv("iconPosition"),
    onChange: value => ({
      [dvk("iconPosition")]: value
    })
  };
}

export function toolbarElementTabsOrientation({ v, device, state }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("verticalMode"),
    label: t("Orientation"),
    type: "radioGroup",
    choices: [
      {
        value: "on",
        icon: "nc-vertical-items"
      },
      {
        value: "off",
        icon: "nc-horizontal-items"
      }
    ],
    value: dvv("verticalMode"),
    onChange: value => ({
      [dvk("verticalMode")]: value
    })
  };
}

export function toolbarElementTabsStyle({ v, device, state }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("navStyle"),
    label: t("Style"),
    type: "radioGroup",
    choices: [
      v.verticalMode === "off"
        ? {
            value: "style-1",
            icon: "nc-tabs-style-2"
          }
        : {
            value: "style-1",
            icon: "nc-tabs-style-4"
          },
      v.verticalMode === "off"
        ? {
            value: "style-2",
            icon: "nc-tabs-style-1"
          }
        : {
            value: "style-2",
            icon: "nc-tabs-style-3"
          }
    ],
    value: dvv("navStyle"),
    onChange: value => ({
      [dvk("navStyle")]: value
    })
  };
}
