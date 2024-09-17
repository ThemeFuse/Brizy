import { defaultValueValue } from "../onChange";
import { capByPrefix } from "../string";
import { Toggle } from "../options/utils/Type";

function getShowOnDeviceValue({ v, device, state }) {
  const key = capByPrefix("showOn", device);

  return defaultValueValue({
    v,
    key,
    device,
    state
  });
}

export function styleShowOnEditorFilter({ v, device, state }) {
  if (IS_EDITOR) {
    const showOnDevice = getShowOnDeviceValue({ v, device, state });

    return showOnDevice === Toggle.ON || showOnDevice === undefined
      ? ""
      : "blur(3px)";
  }
}

export function styleShowOnEditorOpacity({ v, device, state }) {
  if (IS_EDITOR) {
    const showOnDevice = getShowOnDeviceValue({ v, device, state });

    return showOnDevice === Toggle.ON || showOnDevice === undefined ? 1 : 0.9;
  }
}

export function styleShowOnPreview({ v, device, state }) {
  if (IS_PREVIEW) {
    const showOnDevice = getShowOnDeviceValue({ v, device, state });

    return showOnDevice === Toggle.OFF && "none";
  }
}
