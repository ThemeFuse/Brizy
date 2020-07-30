import { browserSupports, makeNodeScreenshot } from "visual/utils/screenshots";
import { createBlockScreenshot } from "visual/utils/api/editor/index-new";
import { findDeep } from "visual/utils/object";
import { Block, Screenshot } from "visual/types";

export const createScreenshot = async (
  node: HTMLElement
): Promise<Screenshot | undefined> => {
  const screenshotsSupported: boolean = await browserSupports();

  if (screenshotsSupported) {
    const { src, width, height } = await makeNodeScreenshot(node);
    const { id } = await createBlockScreenshot({
      base64: src,
      blockType: "global"
    });

    return {
      _thumbnailSrc: id,
      _thumbnailWidth: width,
      _thumbnailHeight: height,
      _thumbnailTime: Date.now()
    };
  }
};

export const getBlockData = (blocks: Block[], id: string): Block | null => {
  return findDeep(blocks, ({ value }: Block) => value && value._id === id).obj;
};
