import React from "react";
import { replaceAt, addLast, removeAt } from "timm";
import _ from "underscore";
import TextField from "./common/TextField";
import EditorIcon from "visual/component/EditorIcon";
import ThemeIcon from "visual/component/ThemeIcon";
import ClickOutside from "visual/component/ClickOutside";
import SelectControl from "visual/component/Controls/Select";
import ScrollPane from "visual/component/ScrollPane";
import SelectControlItem from "visual/component/Controls/Select/SelectItem";
import { getStore } from "visual/redux/store";
import { t } from "visual/utils/i18n";

export default class Select extends TextField {
  static get componentTitle() {
    return t("Select");
  }

  static get componentType() {
    return "Select";
  }

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      newItemValue: ""
    };
  }

  handleOptionsChange = (value, index) => {
    const options = replaceAt(this.props.options, index, value);
    this.props.onChange({ options });
  };
  handleOptionsAdd = () => {
    const options = addLast(this.props.options, this.state.newItemValue);
    this.setState({ newItemValue: "" });
    this.props.onChange({ options });
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
    const node = this.selectInput;
    node.classList.add("brz-ed-dd-cancel");
  };
  handleBlur = () => {
    const node = this.selectInput;
    node.classList.remove("brz-ed-dd-cancel");
  };

  renderOptions = () => {
    const isDesktop = getStore().getState().ui.deviceMode === "desktop";
    return _.map(this.props.options, (item, index) => {
      return (
        <div key={index} className="brz-forms__select-item">
          <div className="brz-forms__select-item__input">
            <input
              className="brz-input"
              value={item}
              onChange={e => this.handleOptionsChange(e.target.value, index)}
            />
          </div>
          {isDesktop ? (
            <div
              className="brz-forms__select-item__icon"
              onClick={() => this.handleOptionsRemove(index)}
            >
              <EditorIcon icon="nc-trash" />
            </div>
          ) : null}
        </div>
      );
    });
  };

  renderForEdit = v => {
    const isDesktop = getStore().getState().ui.deviceMode === "desktop";
    const { isOpen, newItemValue } = this.state;
    const scrollPaneHeight =
      (this.props.options.length + Number(isDesktop)) * 52;

    return (
      <ClickOutside onClickOutside={() => this.setState({ isOpen: false })}>
        <div className="brz-forms__select">
          <div className="brz-forms__select-current brz-forms__field">
            <input
              {...v}
              ref={el => {
                this.selectInput = el;
              }}
              className="brz-input"
              onClick={e => {
                this.setState({ isOpen: !isOpen });
                this.handleClick(e);
              }}
              onBlur={this.handleBlur}
            />
            <ThemeIcon
              name="arrow-down"
              type="editor"
              className="brz-forms__select--arrow"
            />
          </div>
          {isOpen && (
            <div className="brz-forms__select-list brz-ed-dd-cancel">
              <ScrollPane style={{ height: scrollPaneHeight }}>
                {this.renderOptions()}
                {isDesktop ? (
                  <div className="brz-forms__select-item">
                    <div className="brz-forms__select-item__input">
                      <input
                        placeholder={t("Add new option")}
                        className="brz-input brz-input__select"
                        value={newItemValue}
                        onChange={({ target: { value } }) =>
                          this.setState({ newItemValue: value })
                        }
                        onKeyUp={e => this.handleKeyUp(e)}
                      />
                    </div>
                    <div
                      className="brz-forms__select-item__icon"
                      onClick={this.handleOptionsAdd}
                    >
                      <EditorIcon icon="nc-arrow-right" />
                    </div>
                  </div>
                ) : null}
              </ScrollPane>
            </div>
          )}
        </div>
      </ClickOutside>
    );
  };

  renderForView = v => {
    const { label, options } = this.props;

    return (
      <div data-label={label}>
        <SelectControl
          inputAttributes={v}
          defaultValue={this.props.label}
          maxItems={options.length + 1}
          itemHeight={52}
        >
          <SelectControlItem value="">{label}</SelectControlItem>
          {options.map((item, index) => {
            return (
              <SelectControlItem key={index} value={item}>
                {item}
              </SelectControlItem>
            );
          })}
        </SelectControl>
      </div>
    );
  };
}
