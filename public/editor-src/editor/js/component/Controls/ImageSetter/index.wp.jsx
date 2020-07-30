import React from "react";
import classnames from "classnames";
import ImageSetter from "./index.jsx";
import EditorIcon from "visual/component/EditorIcon";
import { getImageUid } from "visual/utils/api/editor";
import { getImageFormat, preloadImage } from "visual/utils/image";
import { imageAttachments } from "visual/utils/image/imageAttachments";

export default class WPImageSetter extends ImageSetter {
  wpMediaFrame = null;

  handleWpImageChange = () => {
    const { onlyPointer } = this.props;

    if (onlyPointer) {
      return;
    }

    const wp = global.wp || global.parent.wp;

    if (!wp) {
      throw new Error("Could not find WordPress on global object (window.wp)");
    }

    if (!wp.media) {
      throw new Error(
        "Could not find WordPress media object (window.wp.media). Make sure the WordPress media script is enqueued."
      );
    }

    if (!this.wpMediaFrame) {
      this.wpMediaFrame = wp.media({
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
      this.wpMediaFrame.on("select", () => {
        const attachment = this.wpMediaFrame
          .state()
          .get("selection")
          .first();

        getImageUid(attachment.get("id"))
          .then(r => {
            imageAttachments.add(r.uid);

            const { x, y } = this.props;
            const { url } = attachment.toJSON();

            // we use preloadImage function not attachment.get("width"), because
            // for some svg it returns wrong sizes(width/height = 0)
            preloadImage(url).then(({ width, height }) => {
              const newValue = {
                x,
                y,
                src: r.uid,
                width,
                height,
                extension: getImageFormat(url)
              };

              if (this.mounted) {
                this.setState(newValue);
              }
              this.props.onChange(newValue, { isChanged: "image" });
            });
          })
          .catch(e => {
            console.error("failed to get attachment uid", e);
          });
      });
    }

    this.wpMediaFrame.open();
  };

  componentWillUnmount() {
    if (super.componentWillUnmount) {
      super.componentWillUnmount();
    }

    if (this.wpMediaFrame) {
      this.wpMediaFrame.detach();
      this.wpMediaFrame = null;
    }
  }

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
