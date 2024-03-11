import classnames from "classnames";
import React, { Component, ComponentType, MouseEvent, TouchEvent } from "react";
import { HSLAChange } from "visual/component/Controls/ColorPicker2/types";
import { GlobalMeta } from "visual/component/Options/Type";
import * as hue from "../helpers/hue";
import { disableIframeEvents, enableIframeEvents, isInIframe } from "../utils";

import HSLA = tinycolor.ColorFormats.HSLA;

export interface Props {
  direction: string;
  hsl: HSLA;
  contentWindow: () => Window | null;
  Pointer?: ComponentType;
  onChange: (v: HSLAChange, meta: GlobalMeta) => void;
  radius?: string;
  shadow?: string;
}

export class Hue extends Component<Props> {
  static defaultProps = {
    contentWindow: () => window
  };

  componentWillUnmount() {
    this.unbindEventListeners();
  }

  container: null | HTMLDivElement = null;

  handleChange = (e: TouchEvent | MouseEvent, isChanging?: boolean) => {
    const contentWindow = this.props.contentWindow() || window;
    const change = hue.calculateChange({
      e,
      contentWindow,
      direction: this.props.direction,
      hsl: this.props.hsl,
      container: this.container
    });

    if (change && this.props.onChange) {
      this.props.onChange(
        { ...change, wasChanged: "hue" },
        {
          isChanging: isChanging ?? false
        }
      );
    }
  };

  handleMouseDown = (e: MouseEvent) => {
    this.handleChange(e, true);
    const contentWindow = this.props.contentWindow();

    if (contentWindow) {
      if (!isInIframe(contentWindow)) {
        disableIframeEvents(contentWindow);
      }
      contentWindow.addEventListener(
        "mousemove",
        this.handleMouseMove as () => void
      );
      contentWindow.addEventListener("mouseup", this.handleMouseUp);
    }
  };

  handleMouseMove = (e: MouseEvent) => this.handleChange(e, true);

  handleMouseUp = (e: MouseEvent | MouseEventInit) => {
    this.handleChange(e as MouseEvent, false);

    const contentWindow = this.props.contentWindow();
    if (contentWindow && !isInIframe(contentWindow)) {
      enableIframeEvents(contentWindow);
    }
    this.unbindEventListeners();
  };

  unbindEventListeners() {
    const contentWindow = this.props.contentWindow();

    if (contentWindow) {
      contentWindow.removeEventListener(
        "mousemove",
        this.handleMouseMove as () => void
      );
      contentWindow.removeEventListener("mouseup", this.handleMouseUp);
    }
  }

  render() {
    const { direction = "horizontal", Pointer } = this.props;

    const styles = {
      hue: {
        borderRadius: this.props.radius,
        boxShadow: this.props.shadow
      },
      pointer: {
        left: `${(this.props.hsl.h * 100) / 360}%`
      },
      container: {}
    };

    const pointerStyles = {
      left: "0px",
      top: `${-((this.props.hsl.h * 100) / 360) + 100}%`
    };

    return (
      <div className="hue" style={styles.hue}>
        <div
          className={classnames(`hue-${direction}`, "hue-container")}
          style={styles?.container}
          ref={(container) => (this.container = container)}
          onMouseDown={this.handleMouseDown}
          onTouchMove={this.handleChange}
          onTouchStart={this.handleChange}
        >
          <div style={pointerStyles} className="hue-pointer">
            {Pointer ? <Pointer /> : <div className="hue-slider" />}
          </div>
        </div>
      </div>
    );
  }
}

export default Hue;
