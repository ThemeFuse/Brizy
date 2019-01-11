import Editor from "visual/global/Editor";
import { blockTemplateThumbnailUrl } from "./blockTemplateThumbnailUrl";
import { applyFilter } from "visual/utils/filters";

export function blockThumbnailUrl(block) {
  const blockTemplateId = block.blockId;
  const url = blockTemplateThumbnailUrl(Editor.getBlock(blockTemplateId));

  // "blockThumbnailUrl__real" is temporary to avoid breaking change
  // and will be replaced with "blockThumbnailUrl" within the next few releases
  return applyFilter("blockThumbnailUrl__real", url, block);
}
