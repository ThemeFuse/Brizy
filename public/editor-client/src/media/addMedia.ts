import { getImageUid } from "../api";
import { AddMediaData } from "../types/Media";
import { getExtension } from "../utils/getExtension";
import { isValidExtension } from "../utils/isValidExtension";

export const addMedia: AddMediaData = {
  label: "Image",
  handler(res, rej, { acceptedExtensions }) {
    const wp = window.wp || window.parent.wp;

    if (!wp) {
      rej("Could not find WordPress on global object (window.wp)");
      return;
    }

    if (!wp.media) {
      rej(
        "Could not find WordPress media object (window.wp.media). Make sure the WordPress media script is enqueued."
      );
      return;
    }

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

      if (!extension || !isValidExtension(extension, acceptedExtensions)) {
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
          rej("failed to get attachment uid");
          console.error(r);
        });
    });
    wpMediaFrame.on("close", () => {
      html?.classList.remove("brz-ow-hidden");
    });

    // block html scroll
    html?.classList.add("brz-ow-hidden");

    wpMediaFrame.open();
  }
};
