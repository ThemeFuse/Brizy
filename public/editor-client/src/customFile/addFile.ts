import { AddFileData } from "../types/File";
import { t } from "../utils/i18n";
import { handleGetAttachmentById, validateByComponent } from "./utils";

export const addFile: AddFileData = {
  label: "Image",
  handler(res, rej, { componentId }) {
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

      if (componentId) {
        const url = attachment.get("url");
        const filename = attachment.get("title");
        const mimeType = attachment.get("mime");

        fetch(url)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], filename, { type: mimeType });
            validateByComponent(file, componentId)
              .then(() => handleGetAttachmentById(res, attachment))
              .catch((e) => rej(e.message));
          });
      } else {
        handleGetAttachmentById(res, attachment);
      }
    });

    frame.on("escape", () => {
      rej(t("File upload cancelled"));
    });

    frame.open();
  }
};
