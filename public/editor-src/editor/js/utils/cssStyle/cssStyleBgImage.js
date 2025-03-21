import { isEditor } from "visual/providers/RenderProvider";
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

export function cssStyleBgImage({
  v,
  device,
  state,
  renderContext,
  getConfig,
  store,
  prefix = ""
}) {
  const bgImage = isEditor(renderContext)
    ? styleBgImage({ v, device, state, store, getConfig, prefix })
    : styleExportBgImage({ v, device, state, store, getConfig, prefix });

  return `background-image:${bgImage};`;
}

export function cssStyleBgImageHover({
  v,
  store,
  device,
  getConfig,
  renderContext
}) {
  const bgImage = isEditor(renderContext)
    ? styleBgImage({ v, device, store, getConfig, state: "hover" })
    : styleExportBgImage({ v, device, store, getConfig, state: "hover" });

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

export function cssStyleBgImagePosition({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}) {
  const bgImage = styleBgImage({ v, device, state, store, getConfig, prefix });
  const positionX = styleBgPositionX({ v, device, state, store, prefix });
  const positionY = styleBgPositionY({ v, device, state, store, prefix });

  return bgImage === "none"
    ? ""
    : `background-position:${positionX} ${positionY};`;
}

export function cssStyleBgImageAttachment({ v, device, state, store, props }) {
  const dvv = (key) => defaultValueValue({ v, key, device, store, state });
  const { isSlider } = props.meta.section;
  const bgAttachment = styleBgAttachment({ v, isSlider });
  const bgSize = dvv("bgSize");

  return device !== "desktop" ||
    bgAttachment === undefined ||
    bgSize !== "cover"
    ? ""
    : `background-attachment:${bgAttachment};`;
}
