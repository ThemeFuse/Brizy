import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { GlobalBlock } from "visual/types/GlobalBlock";
import type { Screenshot } from "visual/types/Screenshot";
import { createBlockScreenshot } from "visual/utils/api";
import { browserSupports, makeNodeScreenshot } from "visual/utils/screenshots";
import type { Config } from "./types";

export const createScreenshot = async (
  node: HTMLElement,
  config: ConfigCommon
): Promise<Screenshot | undefined> => {
  const screenshotsSupported: boolean = await browserSupports();

  if (screenshotsSupported) {
    try {
      const { src, width, height } = await makeNodeScreenshot(node, config);
      const { id } = await createBlockScreenshot(
        { base64: src, blockType: "global" },
        config
      );

      return {
        _thumbnailSrc: id,
        _thumbnailWidth: width,
        _thumbnailHeight: height,
        _thumbnailTime: Date.now()
      };
    } catch (_) {
      return undefined;
    }
  }
};

export const getBlockType = (
  type: Config["blockType"]
): GlobalBlock["meta"]["type"] => {
  switch (type) {
    case "externalPopup":
    case "popup":
      return "popup";
    case "normal":
      return "normal";
  }
};
