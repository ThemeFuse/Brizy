import { Str } from "@brizy/readers";
import { flattenDeep } from "es-toolkit";
import { isT } from "fp-utilities";
import { makeUrl, parseJSON } from "visual/component/Prompts/common/utils";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { VariationFont } from "visual/types/Fonts";
import { request } from "visual/utils/api";
import { CreateFont, UploadFont } from "../api/types";
import { getFontVariation, normalizeFonts } from "./utils";

export const createFont = async ({ id, name, files, config }: CreateFont) => {
  const { api } = config.urls ?? {};
  const { id: containerId } = config.container;
  const formData = new FormData();

  formData.append("container", Str.read(containerId) ?? "");
  formData.append("uid", id);
  formData.append("family", name);

  const variations: VariationFont[] = flattenDeep(
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
  ).filter(isT);

  return request(
    `${api}/fonts`,
    {
      method: "POST",
      body: formData
    },
    config
  )
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
