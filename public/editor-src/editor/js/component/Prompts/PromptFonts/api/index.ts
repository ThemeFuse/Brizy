import { flatten } from "underscore";
import { makeUrl, parseJSON } from "visual/component/Prompts/common/utils";
import Config from "visual/global/Config";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { VariationFont } from "visual/types";
import { request } from "visual/utils/api";
import { CreateFont, UploadFont } from "../api/types";
import { getFontVariation, normalizeFonts } from "./utils";


export const createFont = async ({ id, name, files }: CreateFont) => {
  const { api } = Config.get("urls");
  const { id: containerId } = Config.get("container");
  const formData = new FormData();

  formData.append("container", containerId);
  formData.append("uid", id);
  formData.append("family", name);

  const variations: VariationFont[] = flatten(
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
    .then((v) => parseJSON<UploadFont>(v))
    .then((res) => normalizeFonts(res, variations));
};

export const deleteFont = (fontId: string, config: ConfigCommon) => {
  const { api } = config?.urls ?? {};
  const { id: containerId } = config.container;
  const url = makeUrl(`${api}/fonts/${fontId}`, {
    container: containerId.toString()
  });

  return request(
    url,
    {
      method: "DELETE"
    },
    config
  );
};
