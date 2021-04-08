import {
  styleBgImage,
  styleExportBgImage,
  styleBgPositionX,
  styleBgPositionY,
  styleBgAttachment,
  styleMediaBg
} from "visual/utils/style2";

export function cssStyleBgImage({ v, device, state }) {
  const bgImage = IS_EDITOR
    ? styleBgImage({ v, device, state })
    : styleExportBgImage({ v, device, state });

  return `background-image:${bgImage};`;
}

export function cssStyleBgImageHover({ v, device }) {
  const bgImage = IS_EDITOR
    ? styleBgImage({ v, device, state: "hover" })
    : styleExportBgImage({ v, device, state: "hover" });

  return bgImage ? `content: "";background-image:${bgImage};` : "";
}

export function cssStyleBgMediaImage({ v, device }) {
  const media = styleMediaBg({ v, device });

  if (media === "image") {
    return "display: block;";
  }

  return "display: none;";
}

export function cssStyleBgImagePosition({ v, device, state }) {
  const bgImage = styleBgImage({ v, device, state });
  const positionX = styleBgPositionX({ v, device, state });
  const positionY = styleBgPositionY({ v, device, state });

  return bgImage === "none"
    ? ""
    : `background-position:${positionX} ${positionY};`;
}

export function cssStyleBgImageAttachment({ v, device, props }) {
  const { isSlider } = props.meta.section;
  const bgAttachment = styleBgAttachment({ v, isSlider });

  return device !== "desktop" || bgAttachment === undefined
    ? ""
    : `background-attachment:${bgAttachment};`;
}
