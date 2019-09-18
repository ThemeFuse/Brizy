import React, { Component } from "react";
import { calculateChange } from "../helpers/alpha";

import Checkboard from "./Checkboard";

export class Alpha extends Component {
  change = null;
  static defaultProps = {
    contentWindow: () => window
  };

  constructor(props) {
    super(props);

    this.state = {
      showTooltip: false
    };
  }

  componentWillUnmount() {
    this.unbindEventListeners();
  }

  handleChange = (e, opacityDragEnd) => {
    const contentWindow = this.props.contentWindow();
    this.change =
      calculateChange(e, contentWindow, this.props, this.container) ||
      this.change;

    if (this.change) {
      // invert opacity
      this.change.a = 1 - this.change.a;
      this.props.onChange &&
        this.props.onChange(
          { ...this.change, opacityDragEnd, wasChanged: "opacity" },
          e
        );
    }
  };

  handleMouseDown = e => {
    this.handleChange(e);
    const contentWindow = this.props.contentWindow();

    contentWindow.addEventListener("mousemove", this.handleChange);
    contentWindow.addEventListener("mouseup", this.handleMouseUp);

    this.setState({
      showTooltip: true
    });
  };

  handleMouseUp = e => {
    this.handleChange(e, true);
    this.unbindEventListeners();

    this.setState({
      showTooltip: false
    });

    this.change = null;
  };

  unbindEventListeners = () => {
    const contentWindow = this.props.contentWindow();

    contentWindow.removeEventListener("mousemove", this.handleChange);
    contentWindow.removeEventListener("mouseup", this.handleMouseUp);
  };

  render() {
    const { direction, rgb } = this.props;
    const gradientAlign = direction === "vertical" ? "to top" : "to right";
    const gradientStyles = {
      background: `linear-gradient(${gradientAlign}, rgba(${rgb.r},${rgb.g},${
        rgb.b
      }, 0) 0%,
           rgba(${rgb.r},${rgb.g},${rgb.b}, 1) 100%)`,
      boxShadow: this.props.shadow,
      borderRadius: this.props.radius
    };

    const pointerStyles =
      direction === "vertical"
        ? {
            left: 0,
            top: `${(1 - rgb.a) * 100}%`
          }
        : {
            left: `${rgb.a * 100}%`
          };

    return (
      <div
        className="color-picker2-alpha-body"
        style={{ borderRadius: this.props.radius }}
      >
        <div className="color-picker2-alpha-checkboard">
          <Checkboard renderers={this.props.renderers} />
        </div>
        <div className="color-picker2-alpha-gradient" style={gradientStyles} />
        <div
          className="color-picker2-alpha-container"
          ref={container => (this.container = container)}
          onMouseDown={this.handleMouseDown}
          onTouchMove={this.handleChange}
          onTouchStart={this.handleChange}
        >
          <div className="color-picker2-alpha-pointer" style={pointerStyles}>
            {this.props.pointer ? (
              this.props.pointer(this.props, this.state.showTooltip)
            ) : (
              <div className="color-picker2-alpha-slider" />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Alpha;
