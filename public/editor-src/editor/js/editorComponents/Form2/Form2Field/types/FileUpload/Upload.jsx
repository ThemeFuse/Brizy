import React, { Component } from "react";
import _ from "underscore";
import classnames from "classnames";
import ThemeIcon from "visual/component/ThemeIcon";
import { t } from "visual/utils/i18n";

class Upload extends Component {
  static defaultProps = {
    id: "",
    className: "",
    name: "",
    value: null,
    placeholder: null,
    required: false,
    accept: "",
    multiple: false,
    onChange: _.noop,
    onBlur: _.noop,
    onClick: _.noop
  };

  renderForEdit() {
    const {
      className: _className,
      value,
      onChange,
      onBlur,
      onClick
    } = this.props;
    const className = classnames("brz-input__upload", _className);

    return (
      <div className={className} onClick={onClick} onBlur={onBlur}>
        <label className="brz-label">
          <input
            className="brz-input brz-input__upload-placeholder"
            type="text"
            value={value}
            onChange={onChange}
          />
          <span className="brz-button">{t("Choose File")}</span>
        </label>
      </div>
    );
  }

  renderForView() {
    const { id, className: _className, placeholder } = this.props;
    const className = classnames("brz-input__upload", _className);

    return (
      <div className={className}>
        <input {...this.props} type="file" className="brz-input" />
        <label htmlFor={id} className="brz-label">
          <span className="brz-span">{placeholder}</span>
          <ThemeIcon
            className="brz-input__upload-delete brz-hidden"
            name="close"
            type="editor"
          />
          <span className="brz-button">{t("Choose File")}</span>
        </label>
      </div>
    );
  }

  render() {
    return IS_EDITOR ? this.renderForEdit() : this.renderForView();
  }
}

export default Upload;
