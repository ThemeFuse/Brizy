import { getImageUid } from "../api";
import { AddMediaData } from "../types/Media";
import { getExtension } from "../utils/getExtension";
import { t } from "../utils/i18n";
import { isValidExtension } from "../utils/isValidExtension";
import { internalAcceptedExtensions } from "./utils";

export const addMedia: AddMediaData = {
  label: "Image",
  handler(res, rej, { acceptedExtensions }) {
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
    const iframe = parent.document.querySelector("#brz-ed-iframe");
    const html = document.querySelector("html");

    const wpMediaFrame = wp.media({
      library: {
        type: "image"
      },
      states: new wp.media.controller.Library({
        library: wp.media.query({ type: "image" }),
        multiple: false,
        title: "Upload media",
        filterable: "uploaded",
        priority: 20
      })
    });

    wpMediaFrame.on("select", () => {
      const attachment = wpMediaFrame.state().get("selection").first();
      const { url, filename } = attachment.toJSON();
      const extension = getExtension(url);
      const allExtensions = [
        ...acceptedExtensions,
        ...internalAcceptedExtensions
      ];

      if (!extension || !isValidExtension(extension, allExtensions)) {
        rej(
          `Failed to upload file. Please upload a valid ${acceptedExtensions.join()}.`
        );
        return;
      }

      getImageUid(attachment.get("id"))
        .then((r) => {
          res({ uid: r.uid, fileName: filename });
        })
        .catch((r: unknown) => {
          rej(t("failed to get attachment uid"));
          console.error(r);
        });
    });

    wpMediaFrame.on("close", () => {
      iframe?.classList.remove("media-modal-open");
      html?.classList.remove("brz-ow-hidden");
    });

    wpMediaFrame.on("escape", () => {
      rej(t("File upload cancelled"));
    });

    iframe?.classList.add("media-modal-open");
    // block html scroll
    html?.classList.add("brz-ow-hidden");

    wpMediaFrame.open();
  }
};
