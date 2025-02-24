import {
  removeFeaturedImage,
  updateFeaturedImage,
  updateFeaturedImageFocalPoint
} from "@/api";
import { t } from "@/utils/i18n";
import { FeaturedImage } from "./types";

export const featuredImage: FeaturedImage = {
  async updateFeaturedImage(res, rej, attachmentId) {
    try {
      const featuredImage = await updateFeaturedImage(attachmentId);
      res(featuredImage);
    } catch (e) {
      rej(t("Fail to update Featured Image"));
    }
  },
  async updateFeaturedImageFocalPoint(
    res,
    rej,
    { attachmentId, pointX, pointY }
  ) {
    try {
      const featuredImageFocalPoint = await updateFeaturedImageFocalPoint(
        attachmentId,
        pointX,
        pointY
      );
      res(featuredImageFocalPoint);
    } catch (e) {
      rej(t("Fail to update Featured Image Focal Point"));
    }
  },
  async removeFeaturedImage(res, rej) {
    try {
      const remove = await removeFeaturedImage();
      res(remove);
    } catch (e) {
      rej(t("Fail to remove Featured Image"));
    }
  }
};
