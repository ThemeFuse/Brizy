import { Model } from "backbone";
import { getAttachmentById } from "../api";
import { UploadData } from "../types/File";
import { Response } from "../types/Response";
import { validateLottie } from "./lottieFile";

export const validateByComponent = (
  file: File,
  componentId: string
): Promise<unknown> => {
  switch (componentId) {
    case "Lottie":
      return validateLottie(file);
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
