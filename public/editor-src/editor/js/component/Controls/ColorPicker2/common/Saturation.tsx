import { throttle } from "es-toolkit";
import React, { Component, ComponentType, MouseEvent, TouchEvent } from "react";
import { HSVAChange } from "visual/component/Controls/ColorPicker2/types";
import { GlobalMeta } from "visual/component/Options/Type";
import * as saturation from "../helpers/saturation";
import { disableIframeEvents, enableIframeEvents, isInIframe } from "../utils";

import HSLA = tinycolor.ColorFormats.HSLA;
import HSVA = tinycolor.ColorFormats.HSVA;

export interface Props {
  onChange: (v: HSVAChange, meta: GlobalMeta) => void;
  hsl: HSLA;
  hsv: HSVA;
  contentWindow: () => Window | null;
  Pointer?: ComponentType;
  radius?: string;
  shadow?: string;
}

export class Saturation extends Component<Props> {
  static defaultProps = {
    contentWindow: () => window
  };
  throttle;
  container: HTMLDivElement | null = null;

  constructor(props: Props) {
    super(props);

    this.throttle = throttle(
      (fn: Props["onChange"], data: HSVAChange, meta: GlobalMeta) => {
        fn({ ...data, wasChanged: "saturation" }, meta);
      },
      50
    );
  }

  componentWillUnmount() {
    this.unbindEventListeners();
  }

  handleChange = (e: MouseEvent | TouchEvent, isChanging?: boolean) => {
    const contentWindow = this.props.contentWindow() || window;

    const data = saturation.calculateChange({
      e,
      contentWindow,
      hsl: this.props.hsl,
      container: this.container
    }) as HSVAChange;

    this.props.onChange &&
      this.throttle(this.props.onChange, data, {
        isChanging: isChanging ?? false
      });
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
    const { Pointer } = this.props;
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
        ref={(container) => (this.container = container)}
        onMouseDown={this.handleMouseDown}
        onTouchMove={this.handleChange}
        onTouchStart={this.handleChange}
      >
        <div style={styles.white} className="saturation-white">
          <div style={styles.black} className="saturation-black" />
          <div style={styles.pointer} className="saturation-pointer">
            {Pointer ? <Pointer /> : <div className="saturation-circle" />}
          </div>
        </div>
      </div>
    );
  }
}

export default Saturation;
