import Editor from "visual/global/Editor";
import { applyFilter } from "visual/utils/filters";
import { blockTemplateThumbnailUrl } from "./blockTemplateThumbnailUrl";
import { placeholderBlockThumbnailUrl } from "./placeholderBlockThumbnailUrl";

export const blockThumbnailData = (block, meta = {}) => {
  const blockTemplateId = block.blockId;
  const blockTemplate = Editor.getBlock(blockTemplateId);
  const data = blockTemplate
    ? {
        url: blockTemplateThumbnailUrl(blockTemplate),
        width: blockTemplate.thumbnailWidth,
        height: blockTemplate.thumbnailHeight
      }
    : {
        url: placeholderBlockThumbnailUrl(),
        width: 500,
        height: 200
      };

  return applyFilter("blockThumbnailData", data, block, meta);
};
