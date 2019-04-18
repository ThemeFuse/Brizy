import React from "react";
import classnames from "classnames";
import Config from "visual/global/Config";
import ImageSetter from "./index.jsx";
import EditorIcon from "visual/component/EditorIcon";
import { getImageUid } from "visual/utils/api/editor";

const { pageAttachments } = Config.get("wp");

export default class WPImageSetter extends ImageSetter {
  handleWpImageChange = () => {
    const wp = global.wp || global.parent.wp;

    if (!wp) {
      throw new Error("Could not find WordPress on global object (window.wp)");
    }

    if (!wp.media) {
      throw new Error(
        "Could not find WordPress media object (window.wp.media). Make sure the WordPress media script is enqueued."
      );
    }

    const frame = wp.media({
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
    frame.on("select", () => {
      const attachment = frame
        .state()
        .get("selection")
        .first();

      getImageUid(attachment.get("id"))
        .then(r => {
          // a little hacky because it mutates the config
          pageAttachments.images[r.uid] = true;

          const newValue = this.getNewValue({
            src: r.uid,
            width: attachment.get("width"),
            height: attachment.get("height")
          });

          if (this.mounted) {
            this.setState(newValue);
          }
          this.props.onChange(newValue, { isChanged: "image" });
        })
        .catch(e => {
          console.error("failed to get attachment uid", e);
        });
    });

    frame.open();
  };

  renderUpload() {
    const { onlyPointer, onUpload } = this.props;
    const { loading } = this.state;
    const className = classnames(
      "brz-label brz-ed-control__focal-point__label",
      {
        "brz-ed-control__focal-point__label--disable": onlyPointer
      }
    );
    const hasCustomUpload = typeof onUpload === "function";

    return (
      <label className={className}>
        {loading ? (
          <div className="brz-ed-control__focal-point__upload brz-ed-control__focal-point__upload--loading">
            <EditorIcon icon="nc-bars" />
          </div>
        ) : (
          <div
            className="brz-ed-control__focal-point__upload"
            onClick={hasCustomUpload ? onUpload : this.handleWpImageChange}
          >
            <EditorIcon icon="nc-upload" />
          </div>
        )}
      </label>
    );
  }
}
