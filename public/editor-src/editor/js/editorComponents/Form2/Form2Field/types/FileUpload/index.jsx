import React from "react";
import classnames from "classnames";
import TextField from "../common/TextField";
import { t } from "visual/utils/i18n";
import Upload from "./Upload";

export default class FileUpload extends TextField {
  static get componentTitle() {
    return t("File");
  }
  static get componentType() {
    return "FileUpload";
  }

  getClassName({ showPlaceholder }) {
    return classnames(
      "brz-input brz-forms2__field brz-forms2__field-fileUpload",
      { "brz-p-events--none": IS_EDITOR && !showPlaceholder }
    );
  }

  getAttributes() {
    const { fileTypes, fileMaxSize } = this.props;

    return {
      accept: fileTypes,
      "data-file-max-size": fileMaxSize
    };
  }

  renderForEdit(v) {
    const { labelType, attr } = v;

    return labelType === "outside" ? (
      <Upload
        {...attr}
        className={this.getClassName(v)}
        value={attr.placeholder}
        onChange={e => {
          this.handleChange({ placeholder: e.target.value });
        }}
      />
    ) : (
      <Upload
        {...attr}
        className={this.getClassName(v)}
        onChange={e => {
          this.handleChange({
            label: e.target.value,
            placeholder: e.target.value
          });
        }}
      />
    );
  }

  renderForView(v) {
    return (
      <Upload {...v.attr} multiple={false} className={this.getClassName(v)} />
    );
  }
}
