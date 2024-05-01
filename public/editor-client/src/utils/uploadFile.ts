import { UploadData } from "../types/File";
import { getBase64 } from "./base64";
import { t } from "./i18n";

interface Options<T> {
  upload: (attachment: string, filename: string) => Promise<T>;
  onUpload: (uploadData: T) => void;
  onError: (e: unknown) => void;
  componentId?: string;
}

export const handleFileUpload = <T = UploadData>(
  File: File,
  { upload, onUpload, onError }: Options<T>
): void => {
  Promise.resolve(File)
    .then(getBase64)
    .then((base64) => {
      if (typeof base64 !== "string") {
        throw {
          status: 406,
          message: t("Extension is not accepted")
        };
      }

      const attachment = base64.replace(/.+;base64,/, "");

      return upload(attachment, File.name).then((res) => {
        return res;
      });
    })
    .then(onUpload)
    .catch(onError);
};
