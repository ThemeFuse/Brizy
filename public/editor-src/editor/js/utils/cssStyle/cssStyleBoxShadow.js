import {
  styleBoxShadowType,
  styleBoxShadowColor,
  styleBoxShadowHorizontal,
  styleBoxShadowVertical,
  styleBoxShadowBlur,
  styleBoxShadowSpread
} from "visual/utils/style2";

// Functia asta nu e nevoie de ea. Codul din ea trebuei sa fie in cssStyleBoxShadow
// Ea a fost facuta doar ca sa rezolvam problema cu safari in elementul image care folosea glamour
export function cssStyleBoxShadowSuffixForGlamour({
  v,
  device,
  state,
  prefix = ""
}) {
  const type = styleBoxShadowType({ v, device, state, prefix });
  const color = styleBoxShadowColor({ v, device, state, prefix });
  const blur = styleBoxShadowBlur({ v, device, state, prefix });
  const spread = styleBoxShadowSpread({ v, device, state, prefix });
  const horizontal =
    type === "inset"
      ? styleBoxShadowHorizontal({ v, device, state, prefix }) * -1
      : styleBoxShadowHorizontal({ v, device, state, prefix });
  const vertical =
    type === "inset"
      ? styleBoxShadowVertical({ v, device, state, prefix }) * -1
      : styleBoxShadowVertical({ v, device, state, prefix });

  if (
    type === "" ||
    type === "off" ||
    (horizontal === 0 && vertical === 0 && blur === 0 && spread === 0)
  ) {
    return "";
  } else {
    const inset = type === "inset" ? "inset " : "";

    return `${inset}${horizontal}px ${vertical}px ${blur}px ${spread}px ${color};`;
  }
}

export function cssStyleBoxShadowSuffixForGlamourImportant({
  v,
  device,
  state,
  prefix = ""
}) {
  const type = styleBoxShadowType({ v, device, state, prefix });
  const color = styleBoxShadowColor({ v, device, state, prefix });
  const blur = styleBoxShadowBlur({ v, device, state, prefix });
  const spread = styleBoxShadowSpread({ v, device, state, prefix });
  const horizontal =
    type === "inset"
      ? styleBoxShadowHorizontal({ v, device, state, prefix }) * -1
      : styleBoxShadowHorizontal({ v, device, state, prefix });
  const vertical =
    type === "inset"
      ? styleBoxShadowVertical({ v, device, state, prefix }) * -1
      : styleBoxShadowVertical({ v, device, state, prefix });

  if (
    type === "" ||
    type === "off" ||
    (horizontal === 0 && vertical === 0 && blur === 0 && spread === 0)
  ) {
    return "";
  } else {
    const inset = type === "inset" ? "inset " : "";

    return `${inset}${horizontal}px ${vertical}px ${blur}px ${spread}px ${color}!important;`;
  }
}

export function cssStyleBoxShadow({ v, device, state, prefix = "" }) {
  const shadow = cssStyleBoxShadowSuffixForGlamour({
    v,
    device,
    state,
    prefix
  });

  if (shadow === "") return "";
  else return `box-shadow:${shadow};`;
}

export function cssStyleBoxShadowImportant({ v, device, state, prefix = "" }) {
  const shadow = cssStyleBoxShadowSuffixForGlamourImportant({
    v,
    device,
    state,
    prefix
  });

  if (shadow === "") return "";
  else return `box-shadow:${shadow};`;
}

export function cssStyleBoxShadowSection({ v, device, state, prefix = "" }) {
  const type = styleBoxShadowType({ v, device, state, prefix });
  const vertical = styleBoxShadowVertical({ v, device, state, prefix });
  const blur = styleBoxShadowBlur({ v, device, state, prefix });
  const color = styleBoxShadowColor({ v, device, state, prefix });

  const diff = vertical < 0 ? -blur : blur;
  const inBoth = vertical === 0;

  if (type === "" || type === "off" || (vertical === 0 && blur === 0)) {
    return "";
  } else {
    if (inBoth) {
      return `box-shadow:inset 0 ${vertical +
        diff}px ${blur}px -${blur}px ${color}, inset 0 -${vertical +
        diff}px ${blur}px -${blur}px ${color};display: block;`;
    } else {
      return `box-shadow:inset 0 ${vertical +
        diff}px ${blur}px -${blur}px ${color}, inset 0 0 0 0 ${color};display: block;`;
    }
  }
}
