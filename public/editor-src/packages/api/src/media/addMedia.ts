import { AddMediaData } from "../types/Media";
import { createUpload } from "../utils/createUpload";
import { uploadImage } from "./utils";

export const addMedia: AddMediaData = {
  label: "Image",
  async handler(res, rej, { acceptedExtensions }) {
    try {
      const file = await createUpload({ accept: "image/*" });

      uploadImage(file, {
        acceptedExtensions: acceptedExtensions,
        onUpload({ uid, fileName }) {
          res({ uid, fileName });
        },
        onError(e) {
          let errorMsg;

          if ((e as { status: number }).status === 413) {
            errorMsg =
              (e as { message?: string }).message || "Image file is too large.";
          } else {
            errorMsg =
              "Failed to upload file. Please upload a valid JPG, PNG, SVG or GIF image.";
          }
          rej(errorMsg);
        }
      });
    } catch (e) {
      rej("File upload cancelled");
    }
  }
};
