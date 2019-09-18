import Config from "visual/global/Config";

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
      block_type: blockType,
      ibsf: screenshotBase64 // ibsf - image base64. abbreviated to avoid problems with anti-malware plugins
    })
  });
};
