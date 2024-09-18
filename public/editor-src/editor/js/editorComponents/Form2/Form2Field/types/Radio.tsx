import RadioControls from "visual/component/Controls/Radio";
import React from "react";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";
import TextField from "./common/TextField";
import { RadioProps } from "./type";
import { AddOption } from "./common/AddOption";
import { createNewFieldOption } from "./utils";

export default class Radio extends TextField {
  static get componentTitle(): string {
    return t("Radio");
  }

  static get componentType(): ElementTypes.Radio {
    return ElementTypes.Radio;
  }

  getClassName(): string {
    return "brz-forms2__field brz-forms2__radio";
  }

  handleAddOption = (value: string) => {
    const { onChange, items } = this.props;
    const newOption = createNewFieldOption(value);

    onChange({ items: [...items, newOption] });
  };

  renderForEdit({ label }: RadioProps): React.JSX.Element {
    const { activeRadioItem, children } = this.props;

    return (
      <div className={this.getClassName()}>
        <RadioControls
          className="brz-forms2__radio-options"
          name={label}
          defaultValue={activeRadioItem}
        >
          {children}
        </RadioControls>
        <AddOption
          onAdd={this.handleAddOption}
          wrapperClassName="brz-forms2__radio-option brz-forms2__radio-option-new"
          iconClassName="brz-forms2__radio-option-icon"
        />
      </div>
    );
  }

  renderForView({ label }: RadioProps): React.JSX.Element {
    const { activeRadioItem, children } = this.props;

    return (
      <div className={this.getClassName()}>
        <RadioControls
          name={label}
          className="brz-forms2__radio-options"
          defaultValue={activeRadioItem}
        >
          {children}
        </RadioControls>
      </div>
    );
  }
}
