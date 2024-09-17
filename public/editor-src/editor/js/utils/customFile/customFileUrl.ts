import Config from "visual/global/Config";
import { getFileFormat } from "./utils";

const isWP = Config.get("wp");

export const customFileUrl = (file: string) => {
  if (!file) return null;

  const { api } = Config.getAll();
  const { fileUrl } = api?.customFile ?? {};

  if (fileUrl) {
    const [uid, filename] = file.split("|||");

    if (isWP) {
      return `${fileUrl}${uid}`;
    }

    const fileExt = getFileFormat(uid);

    if (fileExt) {
      // If the uid has an extension, it means that the file was uploaded by old users and we should keep the old format
      return [fileUrl, uid].join("/");
    }

    return [fileUrl, uid, filename].join("/");
  }
  return undefined;
};
