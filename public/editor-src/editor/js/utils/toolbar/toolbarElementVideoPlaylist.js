import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";

export function toolbarElementVideoPlaylistSizeWidthPixel({
  v,
  device,
  state,
  prefix = "",
  devices = "all",
  disabled = false
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });
  const widthSidebar = capByPrefix(prefix, "widthSidebar");

  return {
    devices,
    id: dvk(widthSidebar),
    label: t("Sidebar"),
    type: "slider",
    disabled,
    slider: {
      min: 200,
      max: 1000
    },
    input: {
      show: true
    },
    suffix: {
      show: true,
      choices: [{ title: "px", value: "px" }]
    },
    value: {
      value: dvv(widthSidebar)
    },
    onChange: ({ value }) => ({
      [dvk(widthSidebar)]: value
    })
  };
}

export function toolbarElementVideoPlaylistItemImageSize({
  v,
  device,
  state,
  prefix = "",
  position = 10,
  devices = "all"
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });
  const widthImage = capByPrefix(prefix, "widthImage");

  return {
    devices,
    id: dvk(widthImage),
    label: t("Size"),
    type: "slider",
    position,
    slider: {
      min: 0,
      max: 500
    },
    input: {
      show: true
    },
    suffix: {
      show: true,
      choices: [{ title: "px", value: "px" }]
    },
    value: {
      value: dvv(widthImage)
    },
    onChange: ({ value }) => ({
      [dvk(widthImage)]: value
    })
  };
}

export function toolbarElementVideoPlaylistItemGrid({
  v,
  device,
  state,
  disabled = false
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    id: dvk("gridColumn"),
    label: t("Columns"),
    type: "slider",
    disabled,
    slider: {
      min: 1,
      max: 6
    },
    input: {
      show: true,
      max: 6
    },
    value: {
      value: dvv("gridColumn")
    },
    onChange: ({ value }) => ({
      [dvk("gridColumn")]: value
    })
  };
}
