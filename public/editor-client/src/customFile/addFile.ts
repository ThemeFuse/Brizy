import { getAttachmentById } from "../api";
import { AddFileData } from "../types/File";

export const addFile: AddFileData = {
  label: "Image",
  handler(res, rej) {
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
    const frame = wp.media({
      library: {
        type: "image"
      },
      states: new wp.media.controller.Library({
        library: wp.media.query({ type: "image" }),
        multiple: false,
        title: "Upload file",
        filterable: "uploaded",
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
      rej("File upload cancelled");
    });

    frame.open();
  }
};
