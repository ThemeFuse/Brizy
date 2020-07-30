import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { getShapes } from "visual/utils/options";

export function toolbarShapeTopType({ v, device, devices = "all", state }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("shapeTopType"),
    label: t("Type"),
    type: "select",
    devices,
    className: "brz-control__select-option--icon",
    choices: getShapes(),
    value: dvv("shapeTopType")
  };
}

export function toolbarShapeTopFlip({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("shapeTopFlip"),
    label: t("Flip"),
    type: "checkGroup",
    disabled,
    devices,
    choices: [
      {
        value: "shapeTopHorizontal",
        icon: "nc-flip-horizontal"
      }
    ],
    value: {
      shapeTopHorizontal: dvv("shapeTopHorizontal") === "on"
    },
    onChange: ({ shapeTopHorizontal }) => {
      return {
        [dvk("shapeTopHorizontal")]: shapeTopHorizontal ? "on" : "off"
      };
    }
  };
}

export function toolbarShapeBottomType({ v, device, devices = "all", state }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("shapeBottomType"),
    label: t("Type"),
    type: "select",
    devices,
    className:
      "brz-control__select-option--icon brz-control__select-option--icon--bottom",
    choices: getShapes(),
    value: dvv("shapeBottomType")
  };
}

export function toolbarShapeBottomFlip({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("shapeBottomFlip"),
    label: t("Flip"),
    type: "checkGroup",
    devices,
    disabled,
    choices: [
      {
        value: "shapeBottomHorizontal",
        icon: "nc-flip-horizontal"
      }
    ],
    value: {
      shapeBottomHorizontal: dvv("shapeBottomHorizontal") === "on"
    },
    onChange: ({ shapeBottomHorizontal }) => {
      return {
        [dvk("shapeBottomHorizontal")]: shapeBottomHorizontal ? "on" : "off"
      };
    }
  };
}
