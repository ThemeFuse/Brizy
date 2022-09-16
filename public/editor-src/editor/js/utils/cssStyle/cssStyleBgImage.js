import {
  cssStyleDisplayBlock,
  cssStyleDisplayNone
} from "visual/utils/cssStyle";
import {
  styleBgAttachment,
  styleBgImage,
  styleBgPositionX,
  styleBgPositionY,
  styleExportBgImage
} from "visual/utils/style2";
import { defaultValueValue } from "../onChange";

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
  const dvv = (key) => defaultValueValue({ v, key, device });
  const media = dvv("media");

  if (media === "image") {
    return cssStyleDisplayBlock();
  }

  return cssStyleDisplayNone();
}

export function cssStyleBgImagePosition({ v, device, state }) {
  const bgImage = styleBgImage({ v, device, state });
  const positionX = styleBgPositionX({ v, device, state });
  const positionY = styleBgPositionY({ v, device, state });

  return bgImage === "none"
    ? ""
    : `background-position:${positionX} ${positionY};`;
}

export function cssStyleBgImageAttachment({ v, device, state, props }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const { isSlider } = props.meta.section;
  const bgAttachment = styleBgAttachment({ v, isSlider });
  const bgSize = dvv("bgSize");

  return device !== "desktop" ||
    bgAttachment === undefined ||
    bgSize !== "cover"
    ? ""
    : `background-attachment:${bgAttachment};`;
}
