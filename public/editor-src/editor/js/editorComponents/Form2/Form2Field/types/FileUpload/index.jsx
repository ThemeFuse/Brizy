import React from "react";
import classnames from "classnames";
import TextField from "../common/TextField";
import { t } from "visual/utils/i18n";
import Upload from "./Upload";
import { encodeToString } from "visual/utils/string";

export default class FileUpload extends TextField {
  static get componentTitle() {
    return t("File");
  }
  static get componentType() {
    return "FileUpload";
  }

  getClassName() {
    return classnames(
      "brz-input brz-forms2__field brz-forms2__field-fileUpload"
    );
  }

  getAttributes() {
    const { fileTypes, fileMaxSize, error } = this.props;

    return {
      accept: fileTypes,
      "data-file-max-size": fileMaxSize,
      "data-error": encodeToString(error)
    };
  }

  handleTextChange = value => {
    this.handleChange({ fileText: value });
  };

  handleValueChange = e => {
    this.handleChange({
      label: e.target.value,
      placeholder: e.target.value
    });
  };

  renderForEdit(v) {
    const { labelType, attr, showPlaceholder } = v;
    const { fileText } = this.props;

    return labelType === "outside" ? (
      <Upload
        {...attr}
        fileText={fileText}
        className={this.getClassName(v)}
        value={attr.placeholder}
        onChange={this.handleValueChange}
        onChangeText={this.handleTextChange}
        showPlaceholder={showPlaceholder}
      />
    ) : (
      <Upload
        {...attr}
        fileText={fileText}
        className={this.getClassName(v)}
        onChange={this.handleValueChange}
        onChangeText={this.handleTextChange}
        showPlaceholder={showPlaceholder}
      />
    );
  }

  renderForView(v) {
    const { fileText } = this.props;

    return (
      <Upload
        {...v.attr}
        fileText={fileText}
        multiple={false}
        className={this.getClassName(v)}
      />
    );
  }
}
