import _ from "underscore";
import { t } from "visual/utils/i18n";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarElementForm2SpacingPx({
  v,
  device,
  state,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    devices,
    id: dvk("padding"),
    type: "slider",
    label: t("Spacing"),
    slider: {
      min: 0,
      max: 100
    },
    input: {
      show: true
    },
    suffix: {
      show: true,
      choices: [{ title: "px", value: "px" }]
    },
    value: {
      value: dvv("padding")
    },
    onChange: ({ value }) => ({
      [dvk("padding")]: value,
      [dvk("paddingRight")]: value,
      [dvk("paddingBottom")]: value,
      [dvk("paddingLeft")]: value
    })
  };
}

export function toolbarElementForm2Apps({ v, device, state, devices = "all" }) {
  const fields = _.pluck(v.items[0].value.items, "value");
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    devices,
    id: dvk("apps"),
    type: "formApps",
    icon: "nc-extensions-2",
    value: { id: v._id, fields }
  };
}
export function toolbarElementForm2Size({ v, device, state, devices = "all" }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
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
    onChange: size => ({
      [dvk("size")]: size,
      [dvk("paddingTop")]: sizeToPadding[size],
      [dvk("paddingRight")]: sizeToPadding[size] + 10,
      [dvk("paddingBottom")]: sizeToPadding[size],
      [dvk("paddingLeft")]: sizeToPadding[size] + 10
    })
  };
}

export function toolbarElementForm2BorderRadius({
  v,
  device,
  state,
  onChange,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    devices,
    id: dvk("borderRadius"),
    label: t("Corner"),
    type: "slider",
    slider: {
      min: 0,
      max: 100
    },
    input: {
      show: true,
      min: 0
    },
    suffix: {
      show: true,
      choices: [{ title: "px", value: "px" }]
    },
    value: {
      value: dvv("borderRadius")
    },
    onChange: ({ value }, { sliderDragEnd }) => {
      const values = {
        ...{ v, device, state, onChange },
        ...{ value, sliderDragEnd }
      };
      return saveOnChanges(values);
    }
  };
}
