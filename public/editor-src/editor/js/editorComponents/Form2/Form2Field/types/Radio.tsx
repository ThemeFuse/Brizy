import React, { ChangeEvent, KeyboardEvent, ReactElement } from "react";
import { removeAt, replaceAt } from "timm";
import RadioControls, {
  RadioItem as RadioControlsItem
} from "visual/component/Controls/Radio";
import { TextEditor } from "visual/component/Controls/TextEditor";
import EditorIcon from "visual/component/EditorIcon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";
import TextField from "./common/TextField";
import { RadioProps, RadioState } from "./type";

export default class Radio extends TextField {
  static get componentTitle(): string {
    return t("Radio");
  }

  static get componentType(): ElementTypes.Radio {
    return ElementTypes.Radio;
  }

  state: RadioState = {
    value: ""
  };

  getClassName(): string {
    return "brz-forms2__field brz-forms2__radio";
  }

  handleChangeOption(value: string, index: number): void {
    const { options, onChange } = this.props;

    onChange({
      options: replaceAt(options, index, value)
    });
  }

  handleChangeValue = (e: ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      value: e.target.value
    });
  };

  handleKeyUp = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.keyCode === 13) {
      this.handleAddOption();
    }
  };

  handleAddOption = (): void => {
    const { options, onChange } = this.props;
    const { value } = this.state;

    if (value && value.trim()) {
      onChange({ options: [...options, value] });
      this.setState({ value: "" });
    }
  };

  handleRemoveOption(index: number): void {
    const { options, onChange } = this.props;

    onChange({
      options: removeAt(options, index)
    });
  }

  onChangeText = (index: number) => (value: string) =>
    this.handleChangeOption(value, index);

  renderOptions(v: RadioProps): JSX.Element {
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
              <TextEditor
                className="brz-input"
                value={option}
                onChange={this.onChangeText(index)}
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

  renderForEdit(v: RadioProps): JSX.Element {
    const { value } = this.state;

    return (
      <div className={this.getClassName()}>
        {this.renderOptions(v)}

        <div className="brz-forms2__radio-option brz-forms2__radio-option-new">
          <span className="brz-span">
            <input
              type="text"
              className="brz-input"
              placeholder={t("Add new option")}
              value={value}
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

  renderForView({ attr, options: _options }: RadioProps): ReactElement {
    const options = _options.filter((option) => option && option.trim());
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
    ) : (
      <></>
    );
  }
}
