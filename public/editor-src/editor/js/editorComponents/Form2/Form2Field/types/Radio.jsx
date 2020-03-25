import React from "react";
import { replaceAt, removeAt } from "timm";
import TextField from "./common/TextField";
import { t } from "visual/utils/i18n";
import RadioControls, {
  RadioItem as RadioControlsItem
} from "visual/component/Controls/Radio";
import EditorIcon from "visual/component/EditorIcon";

export default class Radio extends TextField {
  static get componentTitle() {
    return t("Radio");
  }

  static get componentType() {
    return "Radio";
  }

  state = {
    value: ""
  };

  getClassName() {
    return "brz-forms2__field brz-forms2__radio";
  }

  handleChangeOption(value, index) {
    const { options, onChange } = this.props;

    onChange({
      options: replaceAt(options, index, value)
    });
  }

  handleChangeValue = e => {
    this.setState({
      value: e.target.value
    });
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

    onChange({
      options: removeAt(options, index)
    });
  }

  renderOptions(v) {
    const { label, options } = v;
    const defaultValue = options[0] || "";

    return (
      <RadioControls
        className="brz-forms2__radio-options"
        name={label}
        defaultValue={defaultValue}
      >
        {options.map((option, index) => (
          <RadioControlsItem
            key={index}
            className="brz-forms2__radio-option"
            value={option}
            checkIcon="check-circle-on"
            unCheckIcon="check-circle-off"
          >
            <div className="brz-forms2__radio-option-name">
              <input
                type="text"
                className="brz-input"
                value={option}
                onChange={e => this.handleChangeOption(e.target.value, index)}
              />
              <span className="brz-span brz-invisible">{option}</span>
            </div>
            <div
              className="brz-forms2__radio-option-icon"
              onClick={() => this.handleRemoveOption(index)}
            >
              <EditorIcon icon="nc-trash" />
            </div>
          </RadioControlsItem>
        ))}
      </RadioControls>
    );
  }

  renderForEdit(v) {
    return (
      <div className={this.getClassName()}>
        {this.renderOptions(v)}

        <div className="brz-forms2__radio-option brz-forms2__radio-option-new">
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
            className="brz-forms2__radio-option-icon"
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
    const defaultValue = options[0] || "";

    return options.length ? (
      <div className={this.getClassName()}>
        <RadioControls
          name={attr.name}
          className="brz-forms2__radio-options"
          defaultValue={defaultValue}
        >
          {options.map((option, index) => (
            <RadioControlsItem
              {...attr}
              key={index}
              className="brz-forms2__radio-option"
              value={option}
              checkIcon="check-circle-on"
              unCheckIcon="check-circle-off"
            >
              <span className="brz-span brz-forms2__radio-option-name">
                {option}
              </span>
            </RadioControlsItem>
          ))}
        </RadioControls>
      </div>
    ) : null;
  }
}
