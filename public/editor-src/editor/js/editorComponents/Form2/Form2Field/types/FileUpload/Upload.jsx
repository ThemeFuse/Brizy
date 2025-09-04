import classnames from "classnames";
import { noop } from "es-toolkit";
import React, { Component } from "react";
import { TextEditor } from "visual/component/Controls/TextEditor";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { isEditor } from "visual/providers/RenderProvider";

class Upload extends Component {
  static defaultProps = {
    id: "",
    className: "",
    name: "",
    value: undefined,
    placeholder: null,
    required: false,
    accept: "",
    multiple: false,
    fileText: "",
    onChange: noop,
    onChangeText: noop,
    onBlur: noop,
    onClick: noop
  };

  renderForEdit() {
    const {
      className: _className,
      value,
      onChange,
      onChangeText,
      onBlur,
      onClick,
      fileText,
      showPlaceholder
    } = this.props;

    const className = classnames("brz-input__upload", _className);

    const classNameInput = classnames(
      "brz-input",
      "brz-input__upload-placeholder",
      {
        "brz-p-events--none": !showPlaceholder
      }
    );

    return (
      <div className={className} onClick={onClick} onBlur={onBlur}>
        <label className="brz-label">
          <input
            className={classNameInput}
            type="text"
            value={value}
            onChange={onChange}
          />
          <span className="brz-button">
            <TextEditor value={fileText} onChange={onChangeText} />
          </span>
        </label>
      </div>
    );
  }

  renderForView() {
    // eslint-disable-next-line no-unused-vars
    const { fileText, renderContext: _, ...props } = this.props;
    const { id, className: _className, placeholder } = props;

    const className = classnames("brz-input__upload", _className);

    return (
      <div className={className}>
        <input {...props} type="file" className="brz-input" />
        <label htmlFor={id} className="brz-label">
          <span className="brz-span">{placeholder}</span>
          <ThemeIcon
            className="brz-input__upload-delete brz-hidden"
            name="close"
            type="editor"
          />
          <span className="brz-button">{fileText}</span>
        </label>
      </div>
    );
  }

  render() {
    return isEditor(this.props.renderContext)
      ? this.renderForEdit()
      : this.renderForView();
  }
}

export default Upload;
