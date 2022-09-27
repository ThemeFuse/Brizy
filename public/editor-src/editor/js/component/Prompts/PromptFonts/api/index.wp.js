import { makeUrl, parseJSON } from "visual/component/Prompts/common/utils";
import Config from "visual/global/Config";
import { request } from "visual/utils/api/index.wp";

export const createFont = ({ id, name, files }) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.createFont,
    hash: api.hash,
    version
  });
  const formData = new FormData();

  formData.append("id", id);
  formData.append("family", name);

  Object.entries(files).forEach(([type, filesType]) => {
    Object.entries(filesType).forEach(([fileType, file]) => {
      if (file) {
        formData.append(`fonts[${type}][${fileType}]`, file, file.name);
      }
    });
  });

  return request(url, {
    method: "POST",
    body: formData
  })
    .then(parseJSON)
    .then((res) => res);
};

export const deleteFont = (fontId) => {
  const { api } = Config.get("wp");
  const version = Config.get("editorVersion");
  const url = makeUrl(api.url, {
    action: api.deleteFont,
    hash: api.hash,
    version,
    id: fontId
  });

  return request(url, {
    method: "POST"
  })
    .then(parseJSON)
    .then((res) => res);
};
