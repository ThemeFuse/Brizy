import Config from "visual/global/Config";
import { request } from "visual/utils/api/editor";

const apiUrl = Config.get("urls").api;

export const uploadBlockScreenshot = ({
  block,
  screenshotBase64: attachment
}) => {
  attachment = attachment.replace(/data:image\/.+;base64,/, "");

  if (block.value._thumbnailSrc) {
    return updateBlockScreenshot({ block, attachment });
  }

  const requestData = {
    attachment
  };

  return request({
    type: "POST",
    dataType: "json",
    url: apiUrl + "/screenshots",
    data: requestData
  });
};

const updateBlockScreenshot = ({ block, attachment }) => {
  const id = block.value._thumbnailSrc;
  const requestData = {
    attachment
  };

  return request({
    type: "PUT",
    dataType: "json",
    url: apiUrl + "/screenshots/" + id,
    data: requestData
  });
};
