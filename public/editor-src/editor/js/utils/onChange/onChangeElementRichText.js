import { defaultValueValue, defaultValueKey } from "./device";
// import { capByPrefix, capitalize } from "visual/utils/string";

export function onChangeElementRichTextBgColorType2({
  v,
  device,
  state,
  colorType
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    [dvk("colorType")]: colorType,
    [dvk("gradientActivePointer")]:
      colorType === "solid" ? "startPointer" : dvv("gradientActivePointer")
  };
}
