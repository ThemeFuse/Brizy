import {
  styleBgImage,
  styleExportBgImage,
  styleBgPositionX,
  styleBgPositionY,
  styleBgAttachment
} from "visual/utils/style2";

export function cssStyleBgImage({ v, device, state }) {
  const bgImage = IS_EDITOR
    ? styleBgImage({ v, device, state })
    : styleExportBgImage({ v, device, state });

  return `background-image:${bgImage};`;
}

export function cssStyleBgImagePosition({ v, device, state }) {
  const bgImage = styleBgImage({ v, device, state });
  const positionX = styleBgPositionX({ v, device, state });
  const positionY = styleBgPositionY({ v, device, state });

  return bgImage === "none"
    ? ""
    : `background-position:${positionX} ${positionY};`;
}

export function cssStyleBgImageAttachment({ v, props }) {
  const { isSlider } = props.meta.section;
  const bgAttachment = styleBgAttachment({ v, isSlider });

  return bgAttachment === undefined
    ? ""
    : `background-attachment:${bgAttachment};`;
}
