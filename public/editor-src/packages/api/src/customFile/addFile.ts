import { AddFileData } from "../types/File";
import { createUpload } from "../utils/createUpload";
import { uploadFile } from "./utils";

export const addFile: AddFileData = {
  label: "File",
  async handler(res, rej, { acceptedExtensions }) {
    try {
      const file = await createUpload({
        accept: acceptedExtensions.join(",")
      });

      uploadFile(file, {
        onUpload({ filename, name }) {
          res({ filename, uid: name });
        },
        onError(e) {
          let errorMsg;

          if ((e as { status: number }).status === 413) {
            errorMsg =
              (e as { message?: string }).message || "File is too large.";
          } else {
            errorMsg = `Failed to upload file. Please upload a valid file`;
          }
          rej(errorMsg);
        }
      });
    } catch (e) {
      rej("File upload cancelled");
    }
  }
};
