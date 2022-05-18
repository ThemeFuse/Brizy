import { defaultValueValue } from "visual/utils/onChange";

export function cssStyleBlendMode({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const blendMode = dvv("blendMode");

  return blendMode ? `mix-blend-mode:${blendMode};` : "";
}
