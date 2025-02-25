import { WP } from "visual/global/Config";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { getFileFormat } from "./utils";

export const customFileUrl = (file: string, config: ConfigCommon) => {
  if (!file) return null;

  const { fileUrl } = config.api?.customFile ?? {};

  if (fileUrl) {
    const [uid, filename] = file.split("|||");
    const isWP = !!(config as WP).wp;

    if (isWP) {
      return `${fileUrl}${uid}`;
    }

    const fileExt = getFileFormat(uid);

    if (fileExt) {
      // If the uid has an extension, it means that the file was uploaded by old users and we should keep the old format
      return [fileUrl, uid].join("/");
    }

    return [fileUrl, uid, filename].filter(Boolean).join("/"); // If the uid or filename is empty, it will be removed from the URL
  }
  return undefined;
};
