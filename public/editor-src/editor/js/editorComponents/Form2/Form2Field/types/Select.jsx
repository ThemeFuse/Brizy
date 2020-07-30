import React from "react";
import _ from "underscore";
import classnames from "classnames";
import Scrollbars from "react-custom-scrollbars";
import { replaceAt, addLast, removeAt } from "timm";
import TextField from "./common/TextField";
import Portal from "visual/component/Portal";
import EditorIcon from "visual/component/EditorIcon";
import ThemeIcon from "visual/component/ThemeIcon";
import ClickOutside from "visual/component/ClickOutside";
import { getStore } from "visual/redux/store";
import { t } from "visual/utils/i18n";
import Toolbar from "visual/component/Toolbar";

const MAX_ITEM_DROPDOWN = 5;

export default class Select extends TextField {
  static get componentTitle() {
    return t("Select");
  }

  static get componentType() {
    return "Select";
  }

  content = React.createRef();
  dropdown = React.createRef();
  scrollbar = React.createRef();

  state = {
    isOpen: false,
    newItemValue: ""
  };

  getClassName() {
    return classnames(
      "brz-forms2__field brz-forms2__field-select",
      this.props.selectClassName
    );
  }

  getAttributes() {
    const { multipleSelection } = this.props;

    return {
      multiple: multipleSelection === "on",
      "data-max-item-dropdown": MAX_ITEM_DROPDOWN
    };
  }

  handleOutside = () => {
    if (this.state.isOpen) {
      this.setState({ isOpen: false });
    }
  };

  handleOptionsChange = (value, index) => {
    const options = replaceAt(this.props.options, index, value);
    this.props.onChange({ options });
  };

  handleOptionsAdd = () => {
    const { newItemValue } = this.state;
    const { options, onChange } = this.props;

    if (newItemValue && newItemValue.trim()) {
      onChange({ options: addLast(options, newItemValue) });
      this.setState({ newItemValue: "" }, () => {
        this.scrollbar.current?.scrollToBottom();
      });
    }
  };

  handleOptionsRemove = index => {
    const options = removeAt(this.props.options, index);
    this.props.onChange({ options });
  };

  handleKeyUp = e => {
    if (e.keyCode === 13) {
      this.handleOptionsAdd();
    }
  };

  handleClick = e => {
    e.preventDefault();
    const node = this.input.current;
    node && node.classList.add("brz-ed-dd-cancel");
  };

  handleBlur = () => {
    const node = this.input.current;
    node && node.classList.remove("brz-ed-dd-cancel");
  };

  handleOpen = e => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }), this.forceUpdate);
    this.handleClick(e);
  };

  getHeight = _.debounce(() => {
    if (this.dropdown.current) {
      const selectItem = this.dropdown.current.querySelector(
        ".brz-forms2__select-item"
      );

      return selectItem.getBoundingClientRect().height * MAX_ITEM_DROPDOWN;
    }

    return "100px";
  });

  renderOptions({ options }, isDesktop) {
    return options.map((item, index) => {
      return (
        <div key={index} className="brz-forms2__select-item">
          <div className="brz-forms2__select-item__input">
            <input
              className="brz-input"
              value={item}
              onChange={e => this.handleOptionsChange(e.target.value, index)}
            />
          </div>
          {isDesktop && (
            <div
              className="brz-forms2__select-item__icon"
              onClick={() => this.handleOptionsRemove(index)}
            >
              <EditorIcon icon="nc-trash" />
            </div>
          )}
        </div>
      );
    });
  }

  renderDropdown(v) {
    const isDesktop = getStore().getState().ui.deviceMode === "desktop";
    const node = this.content.current;
    const { top, left, height, width } = node.getBoundingClientRect();
    const { scrollLeft } = node.ownerDocument.documentElement;
    const dropdownStyle = {
      width,
      top: top + height + window.scrollY,
      left: left + scrollLeft
    };
    const className = classnames(
      "brz-portal-forms__select brz-ed-dd-cancel",
      this.props.selectClassName
    );

    return (
      <Portal node={node.ownerDocument.body} className={className}>
        <Toolbar {...this.props.toolbarExtendSelect}>
          <div
            ref={this.dropdown}
            className="brz-forms2__select-list"
            style={dropdownStyle}
          >
            <Scrollbars
              ref={this.scrollbar}
              autoHeight={true}
              autoHeightMax={this.getHeight()}
            >
              {this.renderOptions(v, isDesktop)}
              {isDesktop && (
                <div className="brz-forms2__select-item">
                  <div className="brz-forms2__select-item__input">
                    <input
                      placeholder={t("Add new option")}
                      className="brz-input brz-input__select"
                      value={this.state.newItemValue}
                      onChange={({ target: { value } }) => {
                        this.setState({ newItemValue: value });
                      }}
                      onKeyUp={e => this.handleKeyUp(e)}
                    />
                  </div>
                  <div
                    className="brz-forms2__select-item__icon"
                    onClick={this.handleOptionsAdd}
                  >
                    <EditorIcon icon="nc-arrow-right" />
                  </div>
                </div>
              )}
            </Scrollbars>
          </div>
        </Toolbar>
      </Portal>
    );
  }

  renderForEdit(v) {
    const { isOpen } = this.state;
    const { labelType, attr, showPlaceholder } = v;
    const clickOutsideExceptions = [
      ".brz-portal-forms__select",
      ".brz-ed-toolbar",
      ".brz-ed-tooltip__content-portal"
    ];
    const className = classnames("brz-input", {
      "brz-p-events--none": !showPlaceholder
    });

    return (
      <ClickOutside
        exceptions={clickOutsideExceptions}
        onClickOutside={this.handleOutside}
      >
        <div ref={this.content} className={this.getClassName(v)}>
          <div className="brz-forms2__select-current" onClick={this.handleOpen}>
            {labelType === "outside" ? (
              <input
                {...attr}
                ref={this.input}
                className={className}
                value={attr.placeholder}
                onChange={e => {
                  this.handleChange({ placeholder: e.target.value });
                }}
                onBlur={this.handleBlur}
              />
            ) : (
              <input
                {...attr}
                ref={this.input}
                className={className}
                onChange={e => {
                  this.handleChange({
                    label: e.target.value,
                    placeholder: e.target.value
                  });
                }}
                onBlur={this.handleBlur}
              />
            )}
            <ThemeIcon
              name="arrow-down"
              type="editor"
              className="brz-forms2__select--arrow"
            />
          </div>
          {isOpen && this.renderDropdown(v)}
        </div>
      </ClickOutside>
    );
  }

  renderForView(v) {
    const { label, attr } = v;
    const options = v.options.filter(option => option && option.trim());

    return options.length ? (
      <div className={this.getClassName(v)}>
        <select {...attr} className="brz-select">
          <option value=" ">{label}</option>
          {options.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    ) : null;
  }
}
