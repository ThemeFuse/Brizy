import { uploadFile as apiUploadFile } from "../api";
import { UploadData } from "../types/File";

export interface Options {
  onUpload: (uploadData: UploadData) => void;
  onError: (e: unknown) => void;
}

/* eslint-disable no-console, no-unused-vars */
const defaultOptions: Options = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onUpload: () => {},
  onError: (e) => console.log("uploadFile default onError", e)
};

async function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export function uploadFile(File: File, options?: Partial<Options>): void {
  const { onUpload, onError }: Options = Object.assign(
    {},
    defaultOptions,
    options
  );

  Promise.resolve(File)
    .then(getBase64)
    .then((base64) => {
      if (typeof base64 !== "string") {
        throw {
          status: 406,
          message: "Extension is not accepted"
        };
      }

      const attachment = base64.replace(/.+;base64,/, "");

      return apiUploadFile({
        attachment,
        filename: File.name
      }).then((res) => {
        return res;
      });
    })
    .then(onUpload)
    .catch(onError);
}
