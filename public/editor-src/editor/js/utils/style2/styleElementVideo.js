import { imageSpecificSize, imageUrl, svgUrl } from "visual/utils/image";
import { defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";

const isSVG = (extension) => extension === "svg";

export function styleElementVideoPaddingRatio({ v, device, state }) {
  const ratio = defaultValueValue({ v, key: "ratio", device, state });
  const paddingRatio = {
    "1:1": "100%",
    "2:1": "50%",
    "2:3": "150%",
    "3:4": "125%",
    "3:2": "66.67%",
    "4:3": "75%",
    "9:16": "177.78%",
    "16:9": "56.25%",
    "21:9": "42.86%"
  };

  return ratio === undefined ? ratio : paddingRatio[ratio];
}

export function styleElementVideoIconFontSize({ v, device, state }) {
  const iconSize = defaultValueValue({ v, key: "iconSize", device, state });
  const iconFontSize = Math.round(iconSize * 0.35);

  return iconSize === undefined ? iconSize : iconFontSize;
}

export function styleElementVideoBgColorRatio({ v, device, state }) {
  const ratio = defaultValueValue({ v, key: "ratio", device, state });
  const colorBgVideoRatio = ratio === "4:3" ? "#000" : "transparent";

  return ratio === undefined ? ratio : colorBgVideoRatio;
}

export function styleElementVideoCoverSrc({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const src = dvv("coverImageSrc");
  const fileName = dvv("coverImageFileName");
  const extension = dvv("coverImageExtension");
  const sizeType = dvv("coverSizeType") ?? "custom";

  if (src === undefined) {
    return undefined;
  }

  if (src === "") {
    return "none";
  }

  if (isSVG(extension)) {
    return `url(${svgUrl(src, { fileName })})`;
  }

  if (sizeType === "custom") {
    return `url(${imageUrl(src, { fileName })})`;
  }

  return `url(${imageSpecificSize(src, { size: sizeType, fileName })})`;
}

export function styleElementVideoCoverPositionX({ v, device, state }) {
  const coverPositionX = defaultValueValue({
    v,
    key: "coverPositionX",
    device,
    state
  });

  return coverPositionX;
}

export function styleElementVideoCoverPositionY({ v, device, state }) {
  const coverPositionY = defaultValueValue({
    v,
    key: "coverPositionY",
    device,
    state
  });

  return coverPositionY;
}

export function styleElementVideoCoverZoom({ v, device, state }) {
  const coverZoom = defaultValueValue({ v, key: "coverZoom", device, state });

  return coverZoom;
}

export function styleElementVideoImageSize({ v, device, state, prefix = "" }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(prefix, "widthImage"));
}

export function styleElementVideoBoxShadowOpacity({ v, device, state }) {
  return defaultValueValue({
    v,
    key: "boxShadowColorOpacity",
    device,
    state
  });
}

export function styleElementVideoBoxShadowColorHex({ v, device, state }) {
  return defaultValueValue({
    v,
    key: "boxShadowColorHex",
    device,
    state
  });
}

export function styleElementVideoBorderOpacity({ v, device, state }) {
  return defaultValueValue({
    v,
    key: "borderColorOpacity",
    device,
    state
  });
}

export function styleElementVideoBorderColorHex({ v, device, state }) {
  return defaultValueValue({
    v,
    key: "borderColorHex",
    device,
    state
  });
}
