import Config from "visual/global/Config";
import { request } from "visual/utils/api/editor";

export const uploadBlockScreenshot = ({
  screenshotId,
  blockType = "normal",
  screenshotBase64
}) => {
  const {
    api: { saveBlockScreenshot },
    page
  } = Config.get("wp");

  return request(saveBlockScreenshot, {
    post: page,
    block_id: screenshotId,
    img: screenshotBase64,
    block_type: blockType
  });
};
