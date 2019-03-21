import Config from "visual/global/Config";
import { request } from "visual/utils/api/editor";

export const uploadBlockScreenshot = ({
  screenshotId,
  blockType = "normal",
  screenshotBase64
}) => {
  const {
    api: { hash, url, saveBlockScreenshot },
    page
  } = Config.get("wp");

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    credentials: "omit",
    body: new URLSearchParams({
      hash,
      action: saveBlockScreenshot,
      post: page,
      block_id: screenshotId,
      img: screenshotBase64,
      block_type: blockType
    })
  });
};
