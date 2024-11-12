import { Model } from "backbone";
import { getAttachmentById } from "../api";
import { UploadData } from "../types/File";
import { Response } from "../types/Response";
import { isLottieFile, validateLottie } from "./lottieFile";

export const validateByComponent = (
  file: File,
  componentId: string,
  url: string
): Promise<unknown> => {
  switch (componentId) {
    case "Lottie": {
      // we should validate only json lottie files
      if (!isLottieFile(url)) {
        return validateLottie(file);
      }
      return Promise.resolve();
    }
    default:
      return Promise.resolve();
  }
};

export const handleGetAttachmentById = (
  res: Response<UploadData>,
  attachment: Model
): void => {
  getAttachmentById(attachment.get("id"))
    .then(({ uid }) => {
      const filename = attachment.get("filename");
      res({ uid, filename });
    })
    .catch((e: unknown) => {
      console.error("failed to get attachment uid", e);
    });
};
