import classnames from "classnames";
import React, { ReactElement, ReactText } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { ToastNotification } from "visual/component/Notifications";
import { getImageUid } from "visual/utils/api/index.wp";
import { t } from "visual/utils/i18n";
import { getImageFormat, preloadImage } from "visual/utils/image";
import { ImageSetter as CloudImageSetter, Value } from "./index.cloud";
import { getExtensionsMessage, isValidExtension } from "./utils";

export class ImageSetter<T extends ReactText> extends CloudImageSetter<T> {
  wpMediaFrame: WPMediaFrame | null = null;

  handleWpImageChange = (): void => {
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

      this.setState({ loading: true });
      wpMediaFrame.on("select", () => {
        const attachment = wpMediaFrame.state().get("selection").first();
        const { acceptedExtensions } = this.props;

        getImageUid(attachment.get("id"))
          .then((r) => {
            const { x, y } = this.props;
            const { url, filename } = attachment.toJSON();

            // we use preloadImage function not attachment.get("width"), because
            // for some svg it returns wrong sizes(width/height = 0)
            preloadImage(url).then(({ width, height }) => {
              const extension = getImageFormat(url);

              if (!extension) {
                ToastNotification.error(
                  t(
                    "Failed to upload file. Please upload a valid JPG, PNG, SVG or GIF image."
                  )
                );
                if (this.mounted) {
                  this.setState({ loading: false });
                }
                return;
              }

              const newValue: Value = {
                x,
                y,
                src: r.uid,
                width,
                height,
                fileName: filename,
                extension
              };

              if (acceptedExtensions && acceptedExtensions.length > 0) {
                const extension = getImageFormat(url);
                if (isValidExtension(extension, acceptedExtensions)) {
                  if (this.mounted) {
                    this.setState<"src" | "width" | "height" | "extension">(
                      newValue
                    );
                  }
                  this.props.onChange(newValue, { isChanged: "image" });
                } else {
                  const extension = getExtensionsMessage(acceptedExtensions);
                  ToastNotification.error(
                    `${t(
                      "Failed to upload file. Please upload a valid "
                    )}${extension} ${t("image")}`
                  );
                }
              } else {
                if (this.mounted) {
                  this.setState<"src" | "width" | "height" | "extension">(
                    newValue
                  );
                }
                this.props.onChange(newValue, { isChanged: "image" });
              }
            });
          })
          .catch((e) => {
            console.error("failed to get attachment uid", e);
          });
        this.setState({ loading: false });
      });
      wpMediaFrame.on("close", () => {
        html?.classList.remove("brz-ow-hidden");
        this.setState({ loading: false });
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
