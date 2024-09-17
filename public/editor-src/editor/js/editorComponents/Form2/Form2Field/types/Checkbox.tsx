import React from "react";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";
import TextField from "./common/TextField";
import { CheckGroup as CheckboxControls } from "visual/component/Controls/CheckGroup";
import { CheckboxProps } from "./type";
import { AddOption } from "./common/AddOption";
import { createNewFieldOption } from "./utils";

export default class Checkbox extends TextField {
  static get componentTitle(): string {
    return t("Checkbox");
  }

  static get componentType(): ElementTypes.Checkbox {
    return ElementTypes.Checkbox;
  }

  getClassName(): string {
    return "brz-forms2__field brz-forms2__checkbox";
  }

  handleAddOption = (value: string) => {
    const { onChange, items } = this.props;
    const newOption = createNewFieldOption(value);

    onChange({ items: [...items, newOption] });
  };

  renderForEdit(): React.JSX.Element {
    const { children, active } = this.props as CheckboxProps;

    return (
      <div className={this.getClassName()}>
        <CheckboxControls
          className="brz-forms2__checkbox-options"
          defaultValue={active}
        >
          {children}
        </CheckboxControls>
        <AddOption
          onAdd={this.handleAddOption}
          wrapperClassName="brz-forms2__checkbox-option brz-forms2__checkbox-option-new"
          iconClassName="brz-forms2__checkbox-option-icon"
        />
      </div>
    );
  }

  renderForView(): React.JSX.Element {
    const { active, children } = this.props as CheckboxProps;

    return (
      <div className={this.getClassName()}>
        <CheckboxControls
          className="brz-forms2__checkbox-options"
          defaultValue={active}
        >
          {children}
        </CheckboxControls>
      </div>
    );
  }
}
