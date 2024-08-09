import { getImageUid } from "../api";
import { AddImageData, ImageUpload } from "../types/Media";

export const uploadImage = ({
  id,
  fileName
}: ImageUpload): Promise<AddImageData> =>
  getImageUid(String(id)).then(({ uid }) => ({ uid, fileName }));

export const internalAcceptedExtensions = ["webp"];
