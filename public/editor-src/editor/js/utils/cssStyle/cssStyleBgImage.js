import {
  cssStyleDisplayBlock,
  cssStyleDisplayNone
} from "visual/utils/cssStyle";
import {
  styleBgImage,
  styleBgPositionX,
  styleBgPositionY,
  styleExportBgImage
} from "visual/utils/style2";
import { defaultValueValue } from "../onChange";

function styleBgAttachment({ v, isSlider }) {
  const { bgAttachment } = v;

  const backgroundAttachment = {
    none: "scroll",
    fixed: "fixed",
    animated: "scroll"
  };

  return backgroundAttachment[isSlider ? "none" : bgAttachment];
}

export function cssStyleBgImage({ v, device, state, prefix = "" }) {
  const bgImage = IS_EDITOR
    ? styleBgImage({ v, device, state, prefix })
    : styleExportBgImage({ v, device, state, prefix });

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

export function cssStyleBgImagePosition({ v, device, state, prefix = "" }) {
  const bgImage = styleBgImage({ v, device, state, prefix });
  const positionX = styleBgPositionX({ v, device, state, prefix });
  const positionY = styleBgPositionY({ v, device, state, prefix });

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
