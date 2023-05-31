import _ from "underscore";
import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementForm2Apps({ v, device, state, devices = "all" }) {
  const fields = _.pluck(v.items[0].value.items, "value");
  const dvk = (key) => defaultValueKey({ key, device, state });

  return {
    devices,
    id: dvk("apps"),
    type: "formApps-dev", 
    config: { 
      id: v._id, 
      fields, 
      icon: "nc-extensions-2" 
    }
  };
}
export function toolbarElementForm2Size({ v, device, state, devices = "all" }) {
  const dvk = (key) => defaultValueKey({ key, device, state });
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const sizeToPadding = {
    small: dvv("sizeSmallPadding"),
    medium: dvv("sizeMediumPadding"),
    large: dvv("sizeLargePadding")
  };

  return {
    devices,
    id: dvk("size"),
    label: t("Size"),
    type: "radioGroup",
    position: 17,
    choices: [
      { icon: "nc-small", value: "small" },
      { icon: "nc-medium", value: "medium" },
      { icon: "nc-large", value: "large" }
    ],
    value: dvv("size"),
    onChange: (size) => ({
      [dvk("size")]: size,
      [dvk("paddingTop")]: sizeToPadding[size],
      [dvk("paddingRight")]: sizeToPadding[size] + 10,
      [dvk("paddingBottom")]: sizeToPadding[size],
      [dvk("paddingLeft")]: sizeToPadding[size] + 10
    })
  };
}
