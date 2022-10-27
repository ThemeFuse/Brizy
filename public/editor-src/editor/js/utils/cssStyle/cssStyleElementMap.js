import { defaultValueValue } from "visual/utils/onChange";

export function cssStyleElementMapPropertyPositionFixed({ v, device, state }) {
  return ["fixed", "absolute"].includes(
    defaultValueValue({ v, key: "elementPosition", device, state })
  )
    ? "height: unset"
    : "";
}
