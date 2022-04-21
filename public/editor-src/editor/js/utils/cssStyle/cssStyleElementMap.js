import { defaultValueValue } from "visual/utils/onChange";
import {
  styleElementVideoCoverSrc,
  styleElementVideoCoverPositionX,
  styleElementVideoCoverPositionY,
  styleElementVideoCoverZoom
} from "visual/utils/style2";

export function cssStyleElementMapPropertyHoverTransition() {
  return "transition-property:filter, box-shadow, border-radius, border;";
}

export function cssStyleElementMapPropertyPositionFixed({ v, device, state }) {
  return ["fixed", "absolute"].includes(
    defaultValueValue({ v, key: "elementPosition", device, state })
  )
    ? "height: unset"
    : "";
}

export function cssStyleElementMapCoverSrc({ v, device, state }) {
  const coverSrc = styleElementVideoCoverSrc({ v, device, state });

  return coverSrc ? `background-image:${coverSrc};` : "";
}

export function cssStyleElementMapCoverPosition({ v, device, state }) {
  const positionX = styleElementVideoCoverPositionX({ v, device, state });
  const positionY = styleElementVideoCoverPositionY({ v, device, state });

  return positionX && positionY
    ? `background-position:${positionX}% ${positionY}%;`
    : "";
}

export function cssStyleElementMapBgSize({ v, device, state }) {
  const coverZoom = styleElementVideoCoverZoom({ v, device, state });

  return coverZoom ? `background-size:${coverZoom}%;` : "";
}
