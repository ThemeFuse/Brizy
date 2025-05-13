import { flattenDeep } from "es-toolkit";
import { isT } from "fp-utilities";
import { makeUrl, parseJSON } from "visual/component/Prompts/common/utils";
import { request } from "visual/utils/api/index.wp";
import { getFontVariation, normalizeFonts } from "./utils";

export const createFont = async ({ id, name, files, config }) => {
  const { api } = config.wp;
  const version = config.editorVersion;
  const url = makeUrl(api.url, {
    action: api.createFont,
    hash: api.hash,
    version
  });
  const formData = new FormData();

  formData.append("id", id);
  formData.append("family", name);

  const variations = flattenDeep(
    await Promise.all(
      Object.entries(files).map(async ([type, filesType]) => {
        return Promise.all(
          Object.entries(filesType).map(async ([fileType, file]) => {
            if (file) {
              formData.append(`fonts[${type}][${fileType}]`, file, file.name);

              return getFontVariation(file);
            }
          })
        );
      })
    )
  ).filter(isT);

  return request(url, {
    method: "POST",
    body: formData
  })
    .then(parseJSON)
    .then((res) => normalizeFonts(res, variations));
};

export const deleteFont = (fontId, config) => {
  const { api } = config.wp;
  const version = config.editorVersion;
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
