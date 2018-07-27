import React, { Component } from "react";
import _ from "underscore";
import color from "./helpers/color";

const DEFAULT_HEX = "#000000";

export default class BrizyFields extends Component {
  static defaultProps = {
    value: {
      hex: DEFAULT_HEX
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      hex: props.value.hex || DEFAULT_HEX
    };
  }

  componentWillReceiveProps({ value: { hex } }) {
    if (hex !== this.state.hex) {
      this.setState({
        hex: hex || DEFAULT_HEX
      });
    }
  }

  onHexChange = ({ target: { value: hex } }) => {
    const { value: { opacity }, onChange } = this.props;

    this.setState({ hex });
    if (hex.length < 6 || !color.isValidHex(hex)) return;

    hex = hex[0] === "#" ? hex : "#" + hex;
    onChange({
      hex: hex.toLowerCase(),
      opacity,
      isChanged: "hex"
    });
  };

  render() {
    return (
      <div className="brz-ed-control__colorPicker__footer">
        <div className="brz-ed-control__colorPicker__group">
          <label htmlFor="hex" className="brz-label brz-ed-control__colorPicker__label">
            Hex:{" "}
          </label>
          <input className="brz-input" value={this.state.hex} onChange={this.onHexChange} />
        </div>
      </div>
    );
  }
}

BrizyFields.defaultProps = {
  value: {
    hex: "#000000",
    opacity: 1
  },
  onChange: _.noop
};
