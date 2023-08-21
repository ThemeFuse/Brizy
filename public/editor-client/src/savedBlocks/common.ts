import { SavedLayoutMeta } from "../types/SavedBlocks";
// Limitation API for getBlocks
export const TOTAL_COUNT = 200;
export const normalBlocks = (
  data: SavedLayoutMeta[],
  screenshotUrl: string
) => {
  return data
    .filter((item) => item.meta.type === "normal")
    .map((item) => {
      return {
        ...item,
        meta: {
          ...item.meta,
          _thumbnailSrc: `${screenshotUrl}/${item.meta._thumbnailSrc}`
        }
      };
    });
};
