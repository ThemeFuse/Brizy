import React from "react";
import _ from "underscore";
import classnames from "classnames";
import ColorPicker from "visual/component/Controls/ColorPicker";

class ColorPickerOptionType extends React.Component {
  static defaultProps = {
    className: "",
    attr: {},
    value: {
      hex: "#000000",
      opacity: 1
    },
    disableOpacity: false,
    onChange: _.noop
  };

  render() {
    const {
      className: _className,
      attr,
      value,
      disableOpacity,
      onChange
    } = this.props;
    const className = classnames(
      "brz-ed-option__colorPicker",
      _className,
      attr.className
    );

    return (
      <div {...attr} className={className}>
        <ColorPicker
          value={value}
          disableOpacity={disableOpacity}
          onChange={onChange}
        />
      </div>
    );
  }
}

export default ColorPickerOptionType;
