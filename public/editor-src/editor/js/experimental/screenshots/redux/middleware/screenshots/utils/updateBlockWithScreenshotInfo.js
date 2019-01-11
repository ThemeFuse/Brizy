export function updateBlockWithScreenshotInfo({ block, src, width, height }) {
  return {
    ...block,
    value: {
      ...block.value,
      _thumbnailSrc: src,
      _thumbnailWidth: width,
      _thumbnailHeight: height,
      _thumbnailTime: Date.now()
    }
  };
}
