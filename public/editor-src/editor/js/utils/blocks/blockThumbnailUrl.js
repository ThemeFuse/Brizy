import Editor from "visual/global/Editor";
import Config from "visual/global/Config";
import { assetUrl } from "visual/utils/asset";

const defaultBlockThumbnailUrl = block => {
  const configUrl = Config.get("urls").blockThumbnails;

  return configUrl
    ? `${configUrl}/${block.id}.jpg`
    : assetUrl(`template/img-block-thumbs/${block.id}.jpg`);
};

export function blockThumbnailUrl(block) {
  const registeredUrlHandlers = Editor.getBlockThumbnailUrlHandlers();

  if (registeredUrlHandlers.length === 0) {
    return defaultBlockThumbnailUrl(block);
  }

  return registeredUrlHandlers.reduce(
    (acc, f) => block => f(block, acc),
    defaultBlockThumbnailUrl
  )(block);
}
