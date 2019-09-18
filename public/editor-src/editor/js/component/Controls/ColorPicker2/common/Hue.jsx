import React, { Component } from "react";
import classnames from "classnames";
import * as hue from "../helpers/hue";

export class Hue extends Component {
  static defaultProps = {
    contentWindow: () => window
  };

  componentWillUnmount() {
    this.unbindEventListeners();
  }

  handleChange = (e, skip) => {
    const contentWindow = this.props.contentWindow();
    const change = hue.calculateChange(
      e,
      contentWindow,
      this.props,
      this.container
    );
    change &&
      this.props.onChange &&
      this.props.onChange({ ...change, wasChanged: "hue" }, e);
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
    const { direction = "horizontal" } = this.props;

    const styles = {
      hue: {
        borderRadius: this.props.radius,
        boxShadow: this.props.shadow
      },
      pointer: {
        left: `${this.props.hsl.h * 100 / 360}%`
      }
    };

    const pointerStyles = {
      left: "0px",
      top: `${-(this.props.hsl.h * 100 / 360) + 100}%`
    };

    return (
      <div className="hue" style={styles.hue}>
        <div
          className={classnames(`hue-${direction}`, "hue-container")}
          style={styles.container}
          ref={container => (this.container = container)}
          onMouseDown={this.handleMouseDown}
          onTouchMove={this.handleChange}
          onTouchStart={this.handleChange}
        >
          <div style={pointerStyles} className="hue-pointer">
            {this.props.pointer ? (
              <this.props.pointer {...this.props} />
            ) : (
              <div className="hue-slider" />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Hue;
