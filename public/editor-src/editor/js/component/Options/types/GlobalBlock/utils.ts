import { browserSupports, makeNodeScreenshot } from "visual/utils/screenshots";
import { createBlockScreenshot } from "visual/utils/api";
import { GlobalBlock, Screenshot } from "visual/types";
import { GlobalBlockProps } from "./types";

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

export const getBlocType = (
  type: GlobalBlockProps["blockType"]
): GlobalBlock["meta"]["type"] => {
  switch (type) {
    case "externalPopup":
    case "popup":
      return "popup";
    case "normal":
      return "normal";
  }
};
