import React, { Component } from "react";
import _ from "underscore";
import * as saturation from "../helpers/saturation";

export class Saturation extends Component {
  static defaultProps = {
    contentWindow: () => window
  };

  constructor(props) {
    super(props);

    this.throttle = _.throttle((fn, data, e) => {
      fn({ ...data, wasChanged: "saturation" }, e);
    }, 50);
  }

  componentWillUnmount() {
    this.unbindEventListeners();
  }

  handleChange = (e, skip) => {
    const contentWindow = this.props.contentWindow();

    this.props.onChange &&
      this.throttle(
        this.props.onChange,
        saturation.calculateChange(
          e,
          contentWindow,
          this.props,
          this.container
        ),
        e
      );
  };

  handleMouseDown = e => {
    this.handleChange(e, true);
    const contentWindow = this.props.contentWindow();

    contentWindow.addEventListener("mousemove", this.handleChange);
    contentWindow.addEventListener("mouseup", this.handleMouseUp);
  };

  handleMouseUp = () => {
    this.unbindEventListeners();
  };

  unbindEventListeners() {
    const contentWindow = this.props.contentWindow();

    contentWindow.removeEventListener("mousemove", this.handleChange);
    contentWindow.removeEventListener("mouseup", this.handleMouseUp);
  }

  render() {
    const styles = {
      color: {
        background: `hsl(${this.props.hsl.h},100%, 50%)`,
        borderRadius: this.props.radius
      },
      white: {
        borderRadius: this.props.radius
      },
      black: {
        boxShadow: this.props.shadow,
        borderRadius: this.props.radius
      },
      pointer: {
        top: `${-(this.props.hsv.v * 100) + 100}%`,
        left: `${this.props.hsv.s * 100}%`
      }
    };

    return (
      <div
        style={styles.color}
        className="color-picker2-saturation-body"
        ref={container => (this.container = container)}
        onMouseDown={this.handleMouseDown}
        onTouchMove={this.handleChange}
        onTouchStart={this.handleChange}
      >
        <div style={styles.white} className="saturation-white">
          <div style={styles.black} className="saturation-black" />
          <div style={styles.pointer} className="saturation-pointer">
            {this.props.pointer ? (
              <this.props.pointer {...this.props} />
            ) : (
              <div className="saturation-circle" />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Saturation;
