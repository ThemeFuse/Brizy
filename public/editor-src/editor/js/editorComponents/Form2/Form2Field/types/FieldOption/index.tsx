import React from "react";
import { connect } from "react-redux";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { deviceModeSelector } from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { t } from "visual/utils/i18n";
import { CheckboxIcon } from "./Components/CheckboxIcon";
import defaultValue from "./defaultValue.json";
import * as toolbar from "./toolbar";
import { Props, Value } from "./type";
import { FormInput } from "../../type";
import SelectItem from "./Components/SelectItem";
import CheckboxItem from "./Components/CheckboxItem";
import { DESKTOP } from "visual/utils/responsiveMode";
import { Obj } from "@brizy/readers";
import RadioItem from "./Components/RadioItem";

const mapState = (state: ReduxState) => ({
  deviceMode: deviceModeSelector(state)
});

export const Form2OptionConnector = connect(mapState);

class Form2FieldOption extends EditorComponent<Value, Props> {
  static get componentId(): ElementTypes.Form2FieldOption {
    return ElementTypes.Form2FieldOption;
  }

  static get componentType(): ElementTypes.Form2FieldOption {
    return ElementTypes.Form2FieldOption;
  }

  static get componentTitle(): string {
    return t("Form2FieldOption");
  }

  static defaultValue = defaultValue;

  handleSelectInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.patchValue({ value: e.target.value });
  };

  handleInputChange = (e: string) => {
    this.patchValue({ value: e });
  };

  renderCheckboxIconEditor = (active: boolean) => {
    return <CheckboxIcon type="editor" active={active} />;
  };

  renderCheckboxIconPreview = () => {
    return <CheckboxIcon type="preview" />;
  };

  renderSelectItem(v: Value): React.JSX.Element {
    const { value } = v;
    const { deviceMode, onRemove } = this.props;

    const isDesktop = deviceMode === DESKTOP;

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar)}>
        <SelectItem
          value={value}
          isEditor={IS_EDITOR}
          renderIconTrash={isDesktop}
          onRemove={onRemove}
          handleSelectInputChange={this.handleSelectInputChange}
        />
      </Toolbar>
    );
  }

  renderRadioItem(v: Value): React.JSX.Element {
    const { onRemove, activeRadioItem, onClickRadioIcon, placeholder, label } =
      this.props;
    const { value } = v;

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar)}>
        <RadioItem
          value={value}
          label={label}
          name={label}
          active={activeRadioItem}
          isEditor={IS_EDITOR}
          placeholder={placeholder}
          onRemove={onRemove}
          handleInputChange={this.handleInputChange}
          handleRadioIconClick={onClickRadioIcon}
        />
      </Toolbar>
    );
  }

  renderCheckboxItem(v: Value): React.JSX.Element {
    const { onRemove, active, handleChangeActive, label, required, type } =
      this.props;
    const { value } = v;
    const isActive = Obj.isObject(active) ? active[value] : false;

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar)}>
        <CheckboxItem
          type={type}
          label={label}
          value={value}
          active={active}
          required={required}
          isEditor={IS_EDITOR}
          onRemove={onRemove}
          handleChangeActive={handleChangeActive}
          handleInputChange={this.handleInputChange}
          renderCheckboxIconEditor={() =>
            this.renderCheckboxIconEditor(isActive)
          }
          renderCheckboxIconPreview={this.renderCheckboxIconPreview}
        />
      </Toolbar>
    );
  }

  renderForEdit(v: Value): React.JSX.Element | null {
    const { type } = this.props;

    switch (type) {
      case FormInput.Select: {
        return this.renderSelectItem(v);
      }
      case FormInput.Checkbox: {
        return this.renderCheckboxItem(v);
      }
      case FormInput.Radio: {
        return this.renderRadioItem(v);
      }

      default: {
        return null;
      }
    }
  }
}

export default Form2OptionConnector(Form2FieldOption);
