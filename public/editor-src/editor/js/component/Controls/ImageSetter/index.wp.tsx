import React, { ReactElement, ReactText } from "react";
import classnames from "classnames";
import { ImageSetter as CloudImageSetter, Value } from "./index.cloud";
import EditorIcon from "visual/component/EditorIcon";
import { getImageUid } from "visual/utils/api/index.wp";
import { getImageFormat, preloadImage } from "visual/utils/image";

export class ImageSetter<T extends ReactText> extends CloudImageSetter<T> {
  wpMediaFrame: WPMediaFrame | null = null;

  handleWpImageChange = (): void => {
    const { onlyPointer } = this.props;

    if (onlyPointer) {
      return;
    }

    // @ts-expect-error, we expect window to have wp property
    const wp = global.wp || global.parent.wp;

    if (!wp) {
      throw new Error("Could not find WordPress on global object (window.wp)");
    }

    if (!wp.media) {
      throw new Error(
        "Could not find WordPress media object (window.wp.media). Make sure the WordPress media script is enqueued."
      );
    }

    const html = document.querySelector("html");

    if (!this.wpMediaFrame) {
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
        const attachment = wpMediaFrame
          .state()
          .get("selection")
          .first();

        getImageUid(attachment.get("id"))
          .then(r => {
            const { x, y } = this.props;
            const { url } = attachment.toJSON();

            // we use preloadImage function not attachment.get("width"), because
            // for some svg it returns wrong sizes(width/height = 0)
            preloadImage(url).then(({ width, height }) => {
              const newValue: Value = {
                x,
                y,
                src: r.uid,
                width,
                height,
                extension: getImageFormat(url)
              };

              if (this.mounted) {
                this.setState<"src" | "width" | "height" | "extension">(
                  newValue
                );
              }
              this.props.onChange(newValue, { isChanged: "image" });
            });
          })
          .catch(e => {
            console.error("failed to get attachment uid", e);
          });
      });
      wpMediaFrame.on("close", () => {
        html?.classList.remove("brz-ow-hidden");
      });

      this.wpMediaFrame = wpMediaFrame;
    }

    // block html scroll
    if (html) {
      html.classList.add("brz-ow-hidden");
    }

    this.wpMediaFrame?.open();
  };

  componentWillUnmount(): void {
    super.componentWillUnmount();

    if (this.wpMediaFrame) {
      this.wpMediaFrame.detach();
      this.wpMediaFrame = null;
    }
  }

  onUpload = (): void =>
    this.props.onUpload ? this.props.onUpload() : this.handleWpImageChange();

  renderUpload(): ReactElement {
    const { onlyPointer } = this.props;
    const { loading } = this.state;
    const className = classnames(
      "brz-label brz-ed-control__focal-point__label",
      {
        "brz-ed-control__focal-point__label--disable": onlyPointer
      }
    );
    return (
      <label className={className}>
        {loading ? (
          <div className="brz-ed-control__focal-point__upload brz-ed-control__focal-point__upload--loading">
            <EditorIcon icon="nc-bars" />
          </div>
        ) : (
          <div
            className="brz-ed-control__focal-point__upload"
            onClick={this.onUpload}
          >
            <EditorIcon icon="nc-upload" />
          </div>
        )}
      </label>
    );
  }
}

export default ImageSetter;
