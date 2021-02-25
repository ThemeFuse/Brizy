import { defaultValueValue } from "visual/utils/onChange";

export function styleElementRichTextMarginTop({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("marginTop");
}

export function styleElementRichTextMarginBottom({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("marginBottom");
}
