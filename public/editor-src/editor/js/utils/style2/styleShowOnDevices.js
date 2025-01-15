import { isEditor, isView } from "visual/providers/RenderProvider";
import { defaultValueValue } from "../onChange";
import { Toggle } from "../options/utils/Type";
import { capByPrefix } from "../string";

function getShowOnDeviceValue({ v, device, state }) {
  const key = capByPrefix("showOn", device);

  return defaultValueValue({
    v,
    key,
    device,
    state
  });
}

export function styleShowOnEditorFilter({ v, device, state, renderContext }) {
  if (isEditor(renderContext)) {
    const showOnDevice = getShowOnDeviceValue({ v, device, state });

    return showOnDevice === Toggle.ON || showOnDevice === undefined
      ? ""
      : "blur(3px)";
  }
}

export function styleShowOnEditorOpacity({ v, device, state, renderContext }) {
  if (isEditor(renderContext)) {
    const showOnDevice = getShowOnDeviceValue({ v, device, state });

    return showOnDevice === Toggle.ON || showOnDevice === undefined ? 1 : 0.9;
  }
}

export function styleShowOnPreview({ v, device, state, renderContext }) {
  if (isView(renderContext)) {
    const showOnDevice = getShowOnDeviceValue({ v, device, state });

    return showOnDevice === Toggle.OFF && "none";
  }
}
