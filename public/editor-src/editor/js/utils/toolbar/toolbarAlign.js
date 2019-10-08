import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";

export function toolbarHorizontalAlign({
  v,
  device,
  devices = "all",
  disabled = false,
  state,
  position = 100
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("horizontalAlign"),
    type: "toggle",
    devices,
    disabled,
    position,
    choices: [
      {
        icon: "nc-text-align-left",
        title: t("Align"),
        value: "left"
      },
      {
        icon: "nc-text-align-center",
        title: t("Align"),
        value: "center"
      },
      {
        icon: "nc-text-align-right",
        title: t("Align"),
        value: "right"
      }
    ],
    value: dvv("horizontalAlign"),
    onChange: value => ({
      [dvk("horizontalAlign")]: value
    })
  };
}

export function toolbarHorizontalAlign2({
  v,
  device,
  devices = "all",
  disabled = false,
  state,
  position = 100
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("horizontalAlign"),
    type: "toggle",
    devices,
    disabled,
    position,
    choices: [
      {
        icon: "nc-hrz-align-left",
        title: t("Align"),
        value: "left"
      },
      {
        icon: "nc-hrz-align-center",
        title: t("Align"),
        value: "center"
      },
      {
        icon: "nc-hrz-align-right",
        title: t("Align"),
        value: "right"
      }
    ],
    value: dvv("horizontalAlign"),
    onChange: value => ({
      [dvk("horizontalAlign")]: value
    })
  };
}

export function toolbarVerticalAlign({
  v,
  device,
  state,
  position = 100,
  prefix = "",
  disabled = false,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk(capByPrefix(prefix, "verticalAlign")),
    label: t("Content"),
    type: "radioGroup",
    devices,
    position,
    disabled,
    choices: [
      {
        value: "top",
        icon: "nc-align-top"
      },
      {
        value: "center",
        icon: "nc-align-middle"
      },
      {
        value: "bottom",
        icon: "nc-align-bottom"
      }
    ],
    value: dvv(capByPrefix(prefix, "verticalAlign"))
  };
}

export function toolbarVerticalAlignToggle({
  v,
  device,
  state,
  prefix = "",
  disabled = false,
  position = 110,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk(capByPrefix(prefix, "verticalAlign")),
    type: "toggle",
    position,
    devices,
    disabled,
    choices: [
      {
        icon: "nc-ver-align-top",
        title: t("Align"),
        value: "top"
      },
      {
        icon: "nc-ver-align-middle",
        title: t("Align"),
        value: "center"
      },
      {
        icon: "nc-ver-align-bottom",
        title: t("Align"),
        value: "bottom"
      }
    ],
    value: dvv(capByPrefix(prefix, "verticalAlign")),
    onChange: value => ({
      [dvk(capByPrefix(prefix, "verticalAlign"))]: value
    })
  };
}
