import { getAttachmentById } from "../api";
import { AddFileData } from "../types/File";
import { t } from "../utils/i18n";

export const addFile: AddFileData = {
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
        library: wp.media.query({
          type: "image, audio, video, application, text, pdf"
        }),
        multiple: false,
        title: t("Upload file"),
        filterable: "all",
        priority: 20
      })
    });

    frame.on("select", () => {
      const attachment = frame.state().get("selection").first();

      getAttachmentById(attachment.get("id"))
        .then(({ uid }) => {
          const filename = attachment.get("filename");
          res({ uid, filename });
        })
        .catch((e: unknown) => {
          console.error("failed to get attachment uid", e);
        });
    });

    frame.on("escape", () => {
      rej(t("File upload cancelled"));
    });

    frame.open();
  }
};
