import React from "react";
import _ from "underscore";
import classnames from "classnames";
import ScrollPane from "visual/component/ScrollPane";
import ClickOutside from "visual/component-new/ClickOutside";
import EditorIcon from "visual/component-new/EditorIcon";
import googleFonts from "visual/config/googleFonts";
import { getUsedFonts } from "visual/utils/fonts";
import { t } from "visual/utils/i18n";

function getDropdownHeight(itemsCount, itemHeight, maxItems) {
  const maxHeight = itemHeight * maxItems;
  const itemsHeight = itemsCount * itemHeight;

  return Math.min(maxHeight, itemsHeight);
}

class FontAdder extends React.Component {
  static defaultProps = {
    value: "",
    label: "",
    placeholder: "",
    itemHeight: 30,
    maxItems: 7,
    helperContent: "",
    helper: false,
    attr: {}
  };

  state = {
    value: this.props.value,
    fields: [],
    hideSmartSearch: false
  };

  getGoogleFont = () => {
    const fonts = getUsedFonts();

    const fontIds = fonts.reduce((acc, font) => {
      acc[font.id] = true;
      return acc;
    }, {});

    return _.reject(googleFonts, googleFont => fontIds[googleFont.id] === true);
  };

  onClickOutside = () => {
    if (!this.state.hideSmartSearch) {
      this.setState({
        hideSmartSearch: true
      });
    }
  };

  onAddOptionKeyDown = event => {
    // add option if enter keys is pressed
    if (event.which === 13) {
      event.preventDefault();
      this.onChange();
    }
    // auto complete if tab key is pressed
    if (event.which === 9) {
      event.preventDefault();
      this.setState({
        value: this.getAutoCompleteTitle()
      });
    }
  };

  onClick = (item, event) => {
    event.stopPropagation();
    this.setState({
      value: item.title,
      fields: [item],
      hideSmartSearch: true
    });
  };

  onChange = () => {
    if (!this.isActiveItem()) return;
    this.props.onChange(this.state.fields[0].id);

    this.setState({
      value: "",
      fields: []
    });
  };

  onInputChange = event => {
    const value = event.target.value;
    let fields = [];
    if (value) {
      fields = _.filter(this.getGoogleFont(), item => {
        return item.title.toLowerCase().indexOf(value.toLowerCase()) === 0;
      });
    }

    this.setState({
      value,
      fields,
      hideSmartSearch: false
    });
  };

  getAutoCompleteTitle = () => {
    const { fields, value } = this.state;
    const title = fields[0] ? fields[0].title : "";

    return value.substr(0, value.length) + title.substr(value.length);
  };

  isActiveItem = () => {
    const { value, fields } = this.state;

    const autoCompleteTitle = this.getAutoCompleteTitle();
    return !_.isEmpty(fields) && value && autoCompleteTitle === value;
  };

  renderFields = () => {
    const { fields: currentFields } = this.state;
    const { itemHeight, maxItems } = this.props;

    const fields = _.map(currentFields, (item, index) => {
      return (
        <div
          key={index}
          className="brz-control__select-option"
          onClick={this.onClick.bind(null, item)}
        >
          {item.title}
        </div>
      );
    });
    const scrollPaneStyle = {
      height: getDropdownHeight(currentFields.length, itemHeight, maxItems)
    };

    return (
      <div className="brz-control__select-options">
        <ScrollPane className="brz-ed-scroll-pane" style={scrollPaneStyle}>
          {fields}
        </ScrollPane>
      </div>
    );
  };

  renderLabel = () => {
    const { label, helper: _helper, helperContent } = this.props;
    const helper = _helper ? (
      <div className="brz-ed-option__helper">
        <EditorIcon icon="nc-alert-circle-que" />
        <div className="brz-ed-option__helper__content">{helperContent}</div>
      </div>
    ) : null;

    return (
      <div className="brz-ed-option__label brz-ed-option__font-adder__label">
        {label}
        {helper}
      </div>
    );
  };

  render() {
    const { className: _className, attr, label, helper } = this.props;
    const fields = !this.state.hideSmartSearch ? this.renderFields() : null;

    const className = classnames(
      "brz-ed-option__font-adder",
      _className,
      attr.className
    );
    const selectClassName = classnames(
      "brz-control__select",
      "brz-control__select--dark",
      { opened: this.state.fields.length && !this.state.hideSmartSearch }
    );

    const iconClassName = classnames("brz-ed-input__search__icon", {
      active: this.isActiveItem()
    });

    return (
      <ClickOutside onClickOutside={this.onClickOutside}>
        <div {...attr} className={className}>
          {label || helper ? this.renderLabel() : null}
          <div className={selectClassName}>
            <div className="brz-control__select-current">
              <input
                className="brz-input brz-ed-input__search"
                type="text"
                readOnly
                value={this.getAutoCompleteTitle()}
              />
              <input
                className="brz-input brz-ed-input__search brz-ed-input__search--auto-complete"
                type="text"
                placeholder={this.props.placeholder}
                value={this.state.value}
                onKeyDown={this.onAddOptionKeyDown}
                onChange={this.onInputChange}
              />
              <div
                className={iconClassName}
                title={t("Add new option")}
                onClick={this.onChange}
              >
                <EditorIcon icon="nc-add" />
              </div>
            </div>
            {fields}
          </div>
        </div>
      </ClickOutside>
    );
  }
}

export default FontAdder;
