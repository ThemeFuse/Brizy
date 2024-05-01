import { uploadIcon as apiUploadIcon } from "../api";
import { UploadIconData } from "../types/Icon";
import { handleFileUpload } from "../utils/uploadFile";

export const uploadIcon: UploadIconData = (icon, onUpload, onError) => {
  handleFileUpload(icon, {
    upload: apiUploadIcon,
    onUpload,
    onError
  });
};
