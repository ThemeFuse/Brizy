import React from "react";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";

export default class SearchInput extends React.Component {
  handleInputChange = e => {
    this.props.onChange(e.target.value);
  };

  render() {
    const { value } = this.props;
    const className = classnames("brz-ed-popup__search--icon", {
      active: value.length > 0
    });

    return (
      <div className="brz-ed-popup__search">
        <input
          type="text"
          className="brz-input brz-ed-popup__input"
          placeholder={t("Enter Search Keyword")}
          value={value}
          onChange={this.handleInputChange}
        />
        <div className={className}>
          <EditorIcon icon="nc-search" />
        </div>
      </div>
    );
  }
}
