import Editor from "visual/global/Editor";
import _ from "underscore";

export const getBlocksConfig = _.memoize(() => {
  const blocksConfig = Editor.getBlocks();
  const popupCategory =
    blocksConfig.categories.find(category => category.slug === "popup") || {};

  if (!popupCategory) {
    return blocksConfig;
  }

  const categories = blocksConfig.categories.filter(
    category => category.id !== popupCategory.id
  );
  const blocks = blocksConfig.blocks.filter(
    block => !block.cat.includes(popupCategory.id)
  );

  return {
    ...blocksConfig,
    categories,
    blocks
  };
});
