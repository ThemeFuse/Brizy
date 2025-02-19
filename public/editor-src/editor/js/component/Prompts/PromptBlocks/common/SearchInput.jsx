import classnames from "classnames";
import { noop } from "es-toolkit";
import React from "react";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";

export default class SearchInput extends React.Component {
  static defaultProps = {
    className: "",
    value: "",
    onChange: noop
  };

  handleInputChange = (e) => {
    this.props.onChange(e.target.value);
  };

  render() {
    const { className: _className, value } = this.props;
    const className = classnames("brz-ed-popup-two-search", _className);

    return (
      <div className={className}>
        <input
          type="text"
          className="brz-input brz-ed-popup-two__input"
          placeholder={t("Type to search")}
          value={value}
          onChange={this.handleInputChange}
        />
        <div className="brz-ed-popup-two-search-icon">
          <EditorIcon icon="nc-search" />
        </div>
      </div>
    );
  }
}
