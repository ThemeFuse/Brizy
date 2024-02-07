import React, { ChangeEvent, KeyboardEvent, ReactElement } from "react";
import { omit, removeAt, replaceAt } from "timm";
import CheckboxControls, {
  CheckGroupItem as CheckboxControlsItem
} from "visual/component/Controls/CheckGroup";
import { TextEditor } from "visual/component/Controls/TextEditor";
import EditorIcon from "visual/component/EditorIcon";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";
import TextField from "./common/TextField";
import { Active, CheckboxProps, CheckboxState } from "./type";

export default class Checkbox extends TextField {
  static get componentTitle(): string {
    return t("Checkbox");
  }

  static get componentType(): ElementTypes.Checkbox {
    return ElementTypes.Checkbox;
  }

  state: CheckboxState = {
    value: ""
  };

  getClassName(): string {
    return "brz-forms2__field brz-forms2__checkbox";
  }

  handleActive = (active: Active): void => {
    this.props.onChange({ active });
  };

  handleChangeOption(value: string, index: number): void {
    const { options, onChange } = this.props;

    onChange({
      options: replaceAt(options, index, value)
    });
  }

  handleChangeValue = (e: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ value: e.target.value });
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

  handleRemoveOption(e: React.MouseEvent<HTMLDivElement>, index: number): void {
    const { options, onChange, active } = this.props;
    e.stopPropagation();

    onChange({
      options: removeAt(options, index),
      active: omit(active, options[index])
    });
  }

  onChangeText = (index: number) => (value: string) =>
    this.handleChangeOption(value, index);

  renderIconForEdit = ({ active }: CheckboxProps): JSX.Element => {
    return (
      <div className="brz-control__check-group-icon">
        <EditorIcon
          className="brz-d-block"
          icon={active ? "nc-check-square-on" : "nc-check-square-off"}
        />
      </div>
    );
  };

  renderIconForView = (): JSX.Element => {
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

  renderOptions(v: CheckboxProps): JSX.Element {
    const { label, _id } = v;
    const { active, options } = this.props;

    return (
      <CheckboxControls
        className="brz-forms2__checkbox-options"
        name={label}
        defaultValue={active}
        onChange={this.handleActive}
      >
        {options.map((option: string, index: number) => (
          <CheckboxControlsItem
            key={index}
            className="brz-forms2__checkbox-option"
            name={_id}
            value={option}
            renderIcons={this.renderIconForEdit}
          >
            <div className="brz-forms2__checkbox-option-name">
              <TextEditor
                className="brz-input"
                value={option}
                onChange={this.onChangeText(index)}
              />
              <span className="brz-span brz-invisible">{option}</span>
            </div>
            <div
              className="brz-forms2__checkbox-option-icon"
              onClick={(e) => this.handleRemoveOption(e, index)}
            >
              <EditorIcon icon="nc-trash" />
            </div>
          </CheckboxControlsItem>
        ))}
      </CheckboxControls>
    );
  }

  renderForEdit(v: CheckboxProps): JSX.Element {
    const { value } = this.state;

    return (
      <div className={this.getClassName()}>
        {this.renderOptions(v)}

        <div className="brz-forms2__checkbox-option brz-forms2__checkbox-option-new">
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
            className="brz-forms2__checkbox-option-icon"
            onClick={this.handleAddOption}
          >
            <EditorIcon icon="nc-arrow-right" />
          </div>
        </div>
      </div>
    );
  }

  renderForView({ attr, options: _options }: CheckboxProps): ReactElement {
    const options = _options.filter(
      (option: string) => option && option.trim()
    );

    return options.length ? (
      <div className={this.getClassName()}>
        <CheckboxControls
          className="brz-forms2__checkbox-options"
          defaultValue={this.props.active}
        >
          {options
            .filter((option) => option && option.trim())
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
    ) : (
      <></>
    );
  }
}
