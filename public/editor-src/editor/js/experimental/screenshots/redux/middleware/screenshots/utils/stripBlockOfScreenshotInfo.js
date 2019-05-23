import { updateIn } from "timm";

export function stripBlockOfScreenshotInfo(block) {
  return updateIn(block, ["value"], value => {
    const {
      _thumbnailSrc,
      _thumbnailWidth,
      _thumbnailHeight,
      _thumbnailTime,
      ...other
    } = value;

    return other;
  });
}
