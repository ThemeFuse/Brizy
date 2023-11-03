import { getOptions } from "visual/component/ConditionsComponent";
import { ToastNotification } from "visual/component/Notifications";
import Prompts from "visual/component/Prompts";
import Conf from "visual/global/Config";
import { GlobalBlock, Screenshot } from "visual/types";
import { createBlockScreenshot } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { browserSupports, makeNodeScreenshot } from "visual/utils/screenshots";
import { Config, OpenPromptCondition } from "./types";

export const openPromptCondition = ({
  type,
  _id
}: OpenPromptCondition): void => {
  if (!_id) {
    return ToastNotification.error(t("Something went wrong"));
  }
  Prompts.open({
    prompt: "conditions",
    mode: "single",
    props: {
      options: getOptions(type, _id)
    }
  });
};

export const createScreenshot = async (
  node: HTMLElement
): Promise<Screenshot | undefined> => {
  const screenshotsSupported: boolean = await browserSupports();

  if (screenshotsSupported) {
    try {
      const config = Conf.getAll();
      const { src, width, height } = await makeNodeScreenshot(node);
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
    } catch (e) {
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
