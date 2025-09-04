import classnames from "classnames";
import React from "react";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { encodeToString } from "visual/utils/string";
import TextField from "../common/TextField";
import Upload from "./Upload";

export default class FileUpload extends TextField {
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
      ...makeDataAttr({ name: "file-max-size", value: fileMaxSize }),
      ...makeDataAttr({ name: "error", value: encodeToString(error) })
    };
  }

  handleTextChange = (value) => {
    this.handleChange({ fileText: value });
  };

  handleValueChange = (e) => {
    this.handleChange({
      label: e.target.value,
      placeholder: e.target.value
    });
  };

  renderForEdit(v) {
    const { labelType, attr, showPlaceholder } = v;
    const { fileText, renderContext } = this.props;

    return labelType === "outside" ? (
      <Upload
        {...attr}
        fileText={fileText}
        className={this.getClassName(v)}
        value={attr.placeholder}
        onChange={this.handleValueChange}
        onChangeText={this.handleTextChange}
        showPlaceholder={showPlaceholder}
        renderContext={renderContext}
      />
    ) : (
      <Upload
        {...attr}
        fileText={fileText}
        className={this.getClassName(v)}
        onChange={this.handleValueChange}
        onChangeText={this.handleTextChange}
        showPlaceholder={showPlaceholder}
        renderContext={renderContext}
      />
    );
  }

  renderForView(v) {
    const { fileText, renderContext } = this.props;
    // eslint-disable-next-line no-unused-vars
    const { defaultValue: _, ...attrs } = v.attr;

    return (
      <Upload
        {...attrs}
        fileText={fileText}
        multiple={false}
        className={this.getClassName(v)}
        renderContext={renderContext}
      />
    );
  }
}
