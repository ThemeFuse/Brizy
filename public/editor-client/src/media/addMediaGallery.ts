import {
  AddImageData,
  AddMediaGallery,
  ImageUpload,
  SelectionData
} from "../types/Media";
import { t } from "../utils/i18n";
import { uploadImage } from "./utils";

export const addMediaGallery: AddMediaGallery = {
  label: "Image",
  handler(res, rej) {
    const wp = window.wp || window.parent.wp;

    if (!wp) {
      rej(t("Could not find WordPress on global object (window.wp)"));
      return;
    }

    if (!wp.media) {
      rej(
        t(
          "Could not find WordPress media object (window.wp.media). Make sure the WordPress media script is enqueued."
        )
      );
      return;
    }

    const frame = wp.media({
      library: {
        type: "image"
      },
      states: new wp.media.controller.Library({
        library: wp.media.query({ type: "image" }),
        multiple: true,
        title: "Upload media",
        filterable: "uploaded",
        priority: 20
      })
    });

    const html = document.querySelector("html");

    frame.on("select", () => {
      const ids = frame.state().get("selection")
        .models as unknown as SelectionData<number>[];

      const images: Array<ImageUpload> = ids.map(
        (image: SelectionData<number>) => ({
          id: image.id,
          fileName: image.attributes.filename
        })
      );

      Promise.all(
        images.map((file: ImageUpload) => {
          return uploadImage(file);
        })
      )
        .then((uploadedImages: AddImageData[]) => {
          res(uploadedImages);
        })
        .catch((e) => {
          let errorMsg;

          if ((e as { status: number }).status === 413) {
            errorMsg =
              (e as { message?: string }).message ||
              t("Image file is too large.");
          } else {
            errorMsg = t("Failed to upload file. Please upload a valid image");
          }
          rej(errorMsg);
        });
    });

    frame.on("close", () => {
      html?.classList.add("brz-ow-hidden");
      html?.classList.remove("brz-ow-hidden");
    });

    frame.on("escape", () => {
      rej(t("Media Gallery upload cancelled"));
    });

    frame.open();
  }
};
