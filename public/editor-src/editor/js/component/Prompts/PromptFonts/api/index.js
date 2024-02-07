import { flatten } from "underscore";
import { makeUrl, parseJSON } from "visual/component/Prompts/common/utils";
import Config from "visual/global/Config";
import { request } from "visual/utils/api";
import { getFontVariation, normalizeFonts } from "./utils";

export const createFont = async ({ id, name, files }) => {
  const { api } = Config.get("urls");
  const { id: containerId } = Config.get("container");
  const formData = new FormData();

  formData.append("container", containerId);
  formData.append("uid", id);
  formData.append("family", name);

  const variations = flatten(
    await Promise.all(
      Object.entries(files).map(async ([type, filesType]) => {
        return Promise.all(
          Object.entries(filesType).map(async ([fileType, file]) => {
            if (file) {
              formData.append(`files[${type}][${fileType}]`, file, file.name);
              return getFontVariation(file);
            }
          })
        );
      })
    )
  ).filter(Boolean);

  return request(`${api}/fonts`, {
    method: "POST",
    body: formData
  })
    .then(parseJSON)
    .then((res) => normalizeFonts(res, variations));
};

export const deleteFont = (fontId) => {
  const { api } = Config.get("urls");
  const { id: containerId } = Config.get("container");
  const url = makeUrl(`${api}/fonts/${fontId}`, { container: containerId });

  return request(url, {
    method: "DELETE"
  });
};
