import React from "react";
import FileUpload from "./FileUpload.jsx";
import EditorIcon from "visual/component/EditorIcon";
import { getAttachmentById } from "visual/utils/api";

class FileUploadWP extends FileUpload {
  wpMediaFrame = null;

  handleChange = () => {
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
          multiple: false,
          title: "Upload file",
          filterable: "uploaded",
          priority: 20
        })
      });
      this.wpMediaFrame.on("select", () => {
        const attachment = this.wpMediaFrame
          .state()
          .get("selection")
          .first();

        getAttachmentById(attachment.get("id"))
          .then(({ uid }) => {
            const filename = attachment.get("filename");
            const value = `${uid}|||${filename}`;

            if (this.mounted) {
              this.setState({
                value,
                loading: false
              });
            }

            this.props.onChange(value);
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

  renderUploadButton() {
    return (
      <div className="brz-file-upload" onClick={this.handleChange}>
        <EditorIcon icon="nc-add" />
      </div>
    );
  }
}

export default FileUploadWP;
