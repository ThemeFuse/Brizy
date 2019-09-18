import {
  styleFilterBrightness,
  styleFilterHue,
  styleFilterSaturation,
  styleFilterContrast
} from "visual/utils/style2";

export function cssStyleVideoFilter({ v, device, state }) {
  const brightness = styleFilterBrightness({ v, device, state });
  const hue = styleFilterHue({ v, device, state });
  const saturation = styleFilterSaturation({ v, device, state });
  const contrast = styleFilterContrast({ v, device, state });
  return `filter:brightness(${brightness}%) hue-rotate(${hue}deg) saturate(${saturation}%) contrast(${contrast}%);`;
}
