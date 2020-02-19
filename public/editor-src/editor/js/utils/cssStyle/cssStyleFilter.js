import {
  styleFilterBrightness,
  styleFilterHue,
  styleFilterSaturation,
  styleFilterContrast
} from "visual/utils/style2";

// Functia asta nu e nevoie de ea. Codul din ea trebuei sa fie in cssStyleFilter
// Ea a fost facuta doar ca sa rezolvam problema cu safari in elementul image care folosea glamour
export function cssStyleFilterSuffixForGlamour({
  v,
  device,
  state,
  prefix = ""
}) {
  const brightness = styleFilterBrightness({ v, device, state, prefix });
  const hue = styleFilterHue({ v, device, state, prefix });
  const saturation = styleFilterSaturation({ v, device, state, prefix });
  const contrast = styleFilterContrast({ v, device, state, prefix });

  return brightness === 100 &&
    hue === 0 &&
    saturation === 100 &&
    contrast === 100
    ? ""
    : `brightness(${brightness}%) hue-rotate(${hue}deg) saturate(${saturation}%) contrast(${contrast}%)`;
}

export function cssStyleFilter({ v, device, state, prefix = "" }) {
  const filter = cssStyleFilterSuffixForGlamour({
    v,
    device,
    state,
    prefix
  });

  if (filter === "") return "";
  else return `filter:${filter};`;
}
