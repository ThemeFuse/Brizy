import React from "react";
import ReactDOM from "react-dom";
import _ from "underscore";
import Brizy from "./Brizy";
import { hexToRgba, isHex } from "visual/utils/color";

const DEFAULT_HEX = "#000000";
const DEFAULT_OPACITY = 1;

class ColorPicker2 extends React.Component {
  constructor(props) {
    super(props);

    // this.throttledHandleChange = _.throttle(this.handleChange, 200);
    this.throttledHandleChange = this.handleChange;
  }

  componentDidMount() {
    this.lastValue = this.props.value;
  }

  shouldComponentUpdate({ value }) {
    const { hex, opacity } = value;
    const { hex: lastHex, opacity: lastOpacity } = this.lastValue;

    if (hex === lastHex && opacity === lastOpacity) {
      return false;
    } else {
      this.lastValue = value;
      return true;
    }
  }

  handleChange = value => {
    const {
      hex,
      rgb: { a: opacity },
      wasChanged,
      opacityDragEnd
    } = value;
    this.lastValue = { hex, opacity };

    const newHex = hex.toLowerCase();
    this.props.onChange({
      hex: newHex,
      opacity: Number(Number(opacity).toFixed(2)),
      isChanged: wasChanged === "opacity" ? "opacity" : "hex",
      opacityDragEnd
    });
  };

  getContentWindow = () => {
    const node = ReactDOM.findDOMNode(this);

    return node.ownerDocument.defaultView;
  };

  render() {
    let {
      value: { hex, opacity },
      disableOpacity
    } = this.props;

    hex = !isHex(hex) ? DEFAULT_HEX : hex;
    opacity = isNaN(Number(opacity)) ? DEFAULT_OPACITY : opacity;

    return (
      <Brizy
        color={hexToRgba(hex, opacity)}
        opacity={opacity}
        disableOpacity={disableOpacity}
        contentWindow={this.getContentWindow}
        onChange={this.throttledHandleChange}
      />
    );
  }
}

ColorPicker2.defaultProps = {
  value: {
    hex: DEFAULT_HEX,
    opacity: DEFAULT_OPACITY
  },
  disableOpacity: false,
  onChange: _.noop
};

export default ColorPicker2;
