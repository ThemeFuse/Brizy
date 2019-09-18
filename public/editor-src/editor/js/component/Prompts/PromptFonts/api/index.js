import produce from "immer";
import Config from "visual/global/Config";
import { parseJSON } from "visual/component/Prompts/common/utils";
import { request2 } from "visual/utils/api/editor";

// uid for cloud is id in editor
const normalizeFonts = res => {
  return produce(res, draft => {
    // renamed uid to id
    draft.data.id = draft.data.uid;
    delete draft.data.uid;
  });
};

export const createFont = ({ id, name, files }) => {
  const { api } = Config.get("urls");
  const formData = new FormData();

  formData.append("uid", id);
  formData.append("family", name);

  Object.entries(files).forEach(([type, filesType]) => {
    Object.entries(filesType).forEach(([fileType, file]) => {
      if (file) {
        formData.append(`files[${type}][${fileType}]`, file, file.name);
      }
    });
  });

  return request2(`${api}/fonts`, {
    method: "POST",
    body: formData
  })
    .then(parseJSON)
    .then(normalizeFonts);
};

export const deleteFont = fontId => {
  const { api } = Config.get("urls");

  return request2(`${api}/fonts/${fontId}`, {
    method: "DELETE"
  });
};
