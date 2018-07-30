import React from "react";
import _ from "underscore";
import classnames from "classnames";
import ColorPickerFields from "visual/component/controls/ColorPicker/BrizyFields";

class ColorPickerOptionType extends React.Component {
  static defaultProps = {
    className: "",
    attr: {},
    value: {
      hex: "#000000",
      opacity: 1
    },
    onChange: _.noop
  };

  render() {
    const { className: _className, attr: _attr, value, onChange } = this.props;
    const className = classnames(
      "brz-ed-option__colorPicker__fields",
      _className,
      _attr.className
    );
    const attr = _.omit(_attr, "className");

    return (
      <div className={className} {...attr}>
        <ColorPickerFields value={value} onChange={onChange} />
      </div>
    );
  }
}

export default ColorPickerOptionType;
