import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarShapeTopFlip({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvk = (key) => defaultValueKey({ key, device, state });
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("shapeTopFlip"),
    label: t("Flip"),
    type: "legacy-checkGroup",
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

export function toolbarShapeBottomFlip({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvk = (key) => defaultValueKey({ key, device, state });
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("shapeBottomFlip"),
    label: t("Flip"),
    type: "legacy-checkGroup",
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
