import React from "react";
import classnames from "classnames";
import Options from "visual/component/Options";
import Option from "visual/component/Options/Option";

class MultiPickerOptionType extends React.Component {
  static defaultProps = {
    className: "",
    attr: {},
    picker: {},
    choices: {},
    location: "",
    toolbar: null
  };

  render() {
    const {
      className: _className,
      choices,
      picker,
      attr,
      location,
      toolbar
    } = this.props;

    const className = classnames(
      "brz-ed-option__multiPicker",
      "brz-ed-option__inline",
      _className,
      attr.className
    );
    const hasChoices =
      choices[picker.value] && choices[picker.value].length > 0;

    return (
      <div {...attr} className={className}>
        <div className="brz-ed-multiPicker__head">
          <Option className="brz-ed-multiPicker__head__option" data={picker} />
        </div>
        <div className="brz-ed-multiPicker__body">
          {hasChoices && (
            <Options
              optionClassName="brz-ed-multiPicker__option"
              data={choices[picker.value]}
              location={location}
              toolbar={toolbar}
            />
          )}
        </div>
      </div>
    );
  }
}

export default MultiPickerOptionType;
