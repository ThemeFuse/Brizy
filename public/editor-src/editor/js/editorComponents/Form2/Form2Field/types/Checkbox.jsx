import React from "react";
import { replaceAt, removeAt, omit } from "timm";
import TextField from "./common/TextField";
import { t } from "visual/utils/i18n";
import CheckboxControls, {
  CheckGroupItem as CheckboxControlsItem
} from "visual/component/Controls/CheckGroup";
import EditorIcon from "visual/component/EditorIcon";
import ThemeIcon from "visual/component/ThemeIcon";

export default class Checkbox extends TextField {
  static get componentTitle() {
    return t("Checkbox");
  }

  static get componentType() {
    return "Checkbox";
  }

  state = {
    value: "",
    active: {}
  };

  getClassName() {
    return "brz-forms2__field brz-forms2__checkbox";
  }

  handleActive = active => {
    this.setState({ active });
  };

  handleChangeOption(value, index) {
    const { options, onChange } = this.props;

    onChange({
      options: replaceAt(options, index, value)
    });
  }

  handleChangeValue = e => {
    this.setState({ value: e.target.value });
  };

  handleKeyUp = e => {
    if (e.keyCode === 13) {
      this.handleAddOption();
    }
  };

  handleAddOption = () => {
    const { options, onChange } = this.props;
    const { value } = this.state;

    if (value && value.trim()) {
      onChange({ options: [...options, value] });
      this.setState({ value: "" });
    }
  };

  handleRemoveOption(index) {
    const { options, onChange } = this.props;

    this.setState({ active: omit(this.state.active, options[index]) });
    onChange({ options: removeAt(options, index) });
  }

  renderIconForEdit = ({ active }) => {
    return (
      <div className="brz-control__check-group-icon">
        <EditorIcon
          className="brz-d-block"
          icon={active ? "nc-check-square-on" : "nc-check-square-off"}
        />
      </div>
    );
  };

  renderIconForView = () => {
    return (
      <>
        <div className="brz-control__check-group-icon brz-control__check-group--check">
          <ThemeIcon
            className="brz-d-block"
            name="check-square-on"
            type="editor"
          />
        </div>
        <div className="brz-control__check-group-icon brz-control__check-group--uncheck">
          <ThemeIcon
            className="brz-d-block"
            name="check-square-off"
            type="editor"
          />
        </div>
      </>
    );
  };

  renderOptions(v) {
    const { label, _id } = v;
    const { active } = this.state;

    return (
      <CheckboxControls
        className="brz-forms2__checkbox-options"
        name={label}
        defaultValue={active}
        onChange={this.handleActive}
      >
        {this.props.options.map((option, index) => (
          <CheckboxControlsItem
            key={index}
            className="brz-forms2__checkbox-option"
            name={_id}
            value={option}
            renderIcons={this.renderIconForEdit}
          >
            <div className="brz-forms2__checkbox-option-name">
              <input
                type="text"
                className="brz-input"
                value={option}
                onChange={e => this.handleChangeOption(e.target.value, index)}
              />
              <span className="brz-span brz-invisible">{option}</span>
            </div>
            <div
              className="brz-forms2__checkbox-option-icon"
              onClick={() => this.handleRemoveOption(index)}
            >
              <EditorIcon icon="nc-trash" />
            </div>
          </CheckboxControlsItem>
        ))}
      </CheckboxControls>
    );
  }

  renderForEdit(v) {
    return (
      <div className={this.getClassName()}>
        {this.renderOptions(v)}

        <div className="brz-forms2__checkbox-option brz-forms2__checkbox-option-new">
          <span className="brz-span">
            <input
              type="text"
              className="brz-input"
              placeholder={t("Add new option")}
              value={this.state.value}
              onChange={this.handleChangeValue}
              onKeyUp={this.handleKeyUp}
            />
          </span>
          <div
            className="brz-forms2__checkbox-option-icon"
            onClick={this.handleAddOption}
          >
            <EditorIcon icon="nc-arrow-right" />
          </div>
        </div>
      </div>
    );
  }

  renderForView(v) {
    const { attr } = v;
    const options = v.options.filter(option => option && option.trim());

    return options.length ? (
      <div className={this.getClassName()}>
        <CheckboxControls className="brz-forms2__checkbox-options">
          {options
            .filter(option => option && option.trim())
            .map((option, index) => (
              <CheckboxControlsItem
                {...attr}
                key={index}
                className="brz-forms2__checkbox-option"
                value={option}
                renderIcons={this.renderIconForView}
              >
                <span className="brz-span brz-forms2__checkbox-option-name">
                  {option}
                </span>
              </CheckboxControlsItem>
            ))}
        </CheckboxControls>
      </div>
    ) : null;
  }
}
