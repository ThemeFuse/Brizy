import { noop } from "es-toolkit";
import React, { Component } from "react";
import color from "./helpers/color";

const DEFAULT_HEX = "#000000";

export interface Props<T> {
  value: T;
  onChange: (v: T) => void;
}

interface State {
  hex: string;
}

type Value = {
  hex: string;
  opacity: number;
  isChanged: "hex" | "opacity";
};

export default class BrizyFields extends Component<Props<Value>, State> {
  static defaultProps = {
    value: {
      hex: DEFAULT_HEX
    },
    onChange: noop,
    opacity: 1
  };

  constructor(props: Props<Value>) {
    super(props);

    this.state = {
      hex: props.value.hex || DEFAULT_HEX
    };
  }

  componentDidUpdate(prevProps: Props<Value>) {
    if (prevProps.value.hex !== this.props.value.hex) {
      this.setState({ hex: this.props.value.hex ?? DEFAULT_HEX });
    }
  }

  onHexChange = ({ target: { value: hex } }: { target: { value: string } }) => {
    const {
      value: { opacity },
      onChange
    } = this.props;

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
      <input
        id="hex"
        className="brz-input"
        autoComplete="off"
        value={this.state.hex}
        onChange={this.onHexChange}
      />
    );
  }
}
