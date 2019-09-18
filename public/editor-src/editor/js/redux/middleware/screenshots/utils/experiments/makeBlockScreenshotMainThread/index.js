import {
  calcOptions,
  cloneAndInlineStyles,
  clean,
  inlineAssets,
  makeForeignObjectSVG,
  loadSVGIntoImage,
  getBase64FromImage
} from "./utils";

export async function makeBlockScreenshot(block, options = {}) {
  const node = document.querySelector(`#${block.value._id}`);
  const options_ = calcOptions(options, node);

  if (!node) {
    return Promise.reject(`Could not find block with _id ${block.value._id}`);
  }

  const cloned = await cloneAndInlineStyles(node);

  clean(cloned);
  await inlineAssets(cloned);

  const svg = makeForeignObjectSVG(cloned, options_);

  debugger;

  const img = await loadSVGIntoImage(svg);

  const base64 = getBase64FromImage(img);

  return {
    src: base64,
    width: options_.width,
    height: options_.height
  };
}
