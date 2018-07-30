import Editor from "visual/global/Editor";
import { getStore } from "visual/redux/store";

export function getBlocksThumbs() {
  const { page } = getStore().getState();

  return page.data.items.map(({ blockId, value }) => {
    const { _id } = value;
    const { title, thumbnailWidth, thumbnailHeight } = Editor.getBlock(blockId);

    return {
      id: _id,
      blockId,
      thumbnailWidth,
      thumbnailHeight,
      title
    };
  });
}
