import _ from "underscore";
import { uploadImage as apiUploadImage } from "visual/utils/api";

export interface UploadData {
  name: string;
  width: number;
  height: number;
  fileName: string;
  uid: string;
}

export interface Options {
  acceptedExtensions: string[];
  onBase64: (base64: string) => void;
  onUpload: (uploadData: UploadData) => void;
  onError: (e: unknown) => void;
}

/* eslint-disable no-console, no-unused-vars */
const defaultOptions: Options = {
  acceptedExtensions: ["jpeg", "jpg", "png", "gif"],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onBase64: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onUpload: () => {},
  onError: (e) => console.log("uploadImage default onError", e)
};
/* eslint-enabled no-console, no-unused-vars */

function getBase64(file: File): Promise<string> {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();

    reader.onload = function (e): void {
      if (typeof e.target?.result === "string") {
        resolve(e.target?.result);
      } else {
        reject("Error read file.");
      }
    };
    reader.onerror = function (): void {
      reject("Error read file.");
    };
    reader.onabort = function (): void {
      reject("Abort read file.");
    };
    reader.readAsDataURL(file);
  });
}

/**
 * @typedef {{
 *   id: number
 *   name: string
 * }} Image
 *
 * @typedef {{
 *   onBase64?:any,
 *   acceptedExtensions: Array<string>,
 *   onUpload: function(image:Image):void,
 *   onError: function(response:Response): void,
 * }} Options
 *
 * @param {File} imageFile
 * @param {Options} options
 */
export function uploadImage(imageFile: File, options?: Partial<Options>): void {
  const { acceptedExtensions, onBase64, onUpload, onError }: Options = _.extend(
    {},
    defaultOptions,
    options
  );

  Promise.resolve(imageFile)
    .then((file) => {
      const extension = file.name.split(".").pop();
      const isAcceptedExtension =
        extension &&
        _.some(
          acceptedExtensions,
          (accepted) => accepted === extension.toLowerCase()
        );

      if (!isAcceptedExtension) {
        throw {
          status: 406,
          message: "Extension is not accepted"
        };
      }

      return file;
    })
    .then(getBase64)
    .then((base64) => {
      onBase64(base64);

      const strippedBase64 = base64.replace(/data:image\/.+;base64,/, "");
      return apiUploadImage({
        base64: strippedBase64,
        filename: imageFile.name
      }).then((r) => {
        const image = new Image();
        image.src = base64;

        return new Promise<UploadData>((res, rej) => {
          image.onload = () => {
            res({
              ...r,
              fileName: imageFile.name,
              width: image.width,
              height: image.height
            });
          };
          image.onerror = rej;
        });
      });
    })
    .then(onUpload)
    .catch(onError);
}

export const uploadImagePromise = (
  extensions: string[],
  image: File
): Promise<UploadData> => {
  return new Promise<UploadData>((res, rej) => {
    uploadImage(image, {
      acceptedExtensions: extensions,
      onUpload: res,
      onError: rej
    });
  });
};

export default uploadImage;
