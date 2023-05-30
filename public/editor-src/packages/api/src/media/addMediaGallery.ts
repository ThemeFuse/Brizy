import { AddMediaGallery } from "../types/Media";
import { createUpload } from "../utils/createUpload";
import { uploadImagePromise } from "./utils";

export const addMediaGallery: AddMediaGallery = {
  label: "Image",
  async handler(res, rej, { acceptedExtensions }) {
    try {
      const files = await createUpload({
        accept: "image/*",
        multiple: true
      });

      Promise.all(
        files.map((file: File) => uploadImagePromise(file, acceptedExtensions))
      )
        .then((uploadedFiles) => {
          res(uploadedFiles);
        })
        .catch((e) => {
          let errorMsg;

          if ((e as { status: number }).status === 413) {
            errorMsg =
              (e as { message?: string }).message || "Image file is too large.";
          } else {
            errorMsg = "Failed to upload file. Please upload a valid image";
          }
          rej(errorMsg);
        });
    } catch (e) {
      rej("Media Gallery upload cancelled");
    }
  }
};
