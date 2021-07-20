import {
  styleTextShadowType,
  styleTextShadowColor,
  styleTextShadowHorizontal,
  styleTextShadowVertical,
  styleTextShadowBlur
} from "visual/utils/style2";

// Functia asta nu e nevoie de ea. Codul din ea trebuei sa fie in cssStyleTextShadow
// Ea a fost facuta doar ca sa rezolvam problema cu safari in elementul image care folosea glamour
export function cssStyleTextShadowSuffixForGlamour({
  v,
  device,
  state,
  prefix = ""
}) {
  const type = styleTextShadowType({ v, device, state, prefix });
  const color = styleTextShadowColor({ v, device, state, prefix });
  const blur = styleTextShadowBlur({ v, device, state, prefix });
  const horizontal =
    type === "inset"
      ? styleTextShadowHorizontal({ v, device, state, prefix }) * -1
      : styleTextShadowHorizontal({ v, device, state, prefix });
  const vertical =
    type === "inset"
      ? styleTextShadowVertical({ v, device, state, prefix }) * -1
      : styleTextShadowVertical({ v, device, state, prefix });

  if (
    type === "" ||
    type === "off" ||
    (horizontal === 0 && vertical === 0 && blur === 0)
  ) {
    return "";
  } else {
    const inset = type === "inset" ? "inset " : "";

    return `${inset}${horizontal}px ${vertical}px ${blur}px ${color};`;
  }
}

export function cssStyleTextShadow({ v, device, state, prefix = "" }) {
  const shadow = cssStyleTextShadowSuffixForGlamour({
    v,
    device,
    state,
    prefix
  });

  if (shadow === "") return "";
  else return `text-shadow:${shadow};`;
}
