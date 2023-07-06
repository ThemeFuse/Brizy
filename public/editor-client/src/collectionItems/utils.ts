import { request } from "src/api";
import { t } from "src/utils/i18n";
import { getConfig } from "../config";

export const getCollectionSourceItems = async (id: string) => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url: _url, hash, actions } = config;

  return await request(_url, {
    method: "POST",
    body: new URLSearchParams({
      hash,
      version: editorVersion,
      postType: id,
      action: actions.getPostObjects
    })
  })
    .then((r) => r.json())
    .then((result) => {
      if (!result?.data) {
        throw "Something went wrong";
      }

      return result.data;
    })
    .catch((e) => {
      if (process.env.NODE_ENV === "development") {
        console.error(e);
      }
      return [];
    });
};
