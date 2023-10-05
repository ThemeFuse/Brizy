import React, { Component, ComponentType, MouseEvent, TouchEvent } from "react";
import {
  HSLAChange,
  HSLAwithSource
} from "visual/component/Controls/ColorPicker2/types";
import { calculateChange } from "../helpers/alpha";
import { disableIframeEvents, enableIframeEvents, isInIframe } from "../utils";
import Checkboard from "./Checkboard";

import HSLA = tinycolor.ColorFormats.HSLA;
import RGBA = tinycolor.ColorFormats.RGBA;

interface Props {
  onChange: (v: HSLAChange, e: MouseEvent | TouchEvent) => void;
  contentWindow: () => Window | null;
  direction: string;
  rgb: RGBA;
  hsl: HSLA;
  shadow?: string;
  radius?: string;
  renderers: { canvas?: new () => HTMLCanvasElement };
  Pointer: ComponentType<{ opacity: number; showTooltip: boolean }>;
}

interface State {
  showTooltip: boolean;
  isChanging: boolean;
}

export class Alpha extends Component<Props, State> {
  change: HSLAwithSource | null = null;
  container: HTMLDivElement | null = null;
  static defaultProps = {
    contentWindow: () => window
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      showTooltip: false,
      isChanging: false
    };
  }

  componentWillUnmount() {
    this.unbindEventListeners();
  }

  handleChange = (e: MouseEvent | TouchEvent, opacityDragEnd?: boolean) => {
    const contentWindow = this.props.contentWindow() || window;
    this.change =
      calculateChange({
        e,
        contentWindow: contentWindow,
        hsl: this.props.hsl,
        direction: this.props.direction,
        container: this.container
      }) || this.change;

    if (this.change) {
      // invert opacity
      this.change.a = 1 - this.change.a;
      this.props.onChange &&
        this.props.onChange(
          {
            ...this.change,
            opacityDragEnd: opacityDragEnd,
            wasChanged: "opacity"
          },
          e
        );
    }
  };

  handleMouseDown = (e: MouseEvent) => {
    this.handleChange(e);
    const contentWindow = this.props.contentWindow();

    if (contentWindow) {
      if (!isInIframe(contentWindow)) {
        disableIframeEvents(contentWindow);
      }

      contentWindow.addEventListener(
        "mousemove",
        this.handleChange as () => void
      );
      contentWindow.addEventListener(
        "mouseup",
        this.handleMouseUp as () => void
      );
      this.setState({
        showTooltip: true,
        isChanging: true
      });
    }
  };

  handleMouseUp = (e: MouseEvent) => {
    const contentWindow = this.props.contentWindow();
    if (contentWindow && !isInIframe(contentWindow)) {
      enableIframeEvents(contentWindow);
    }

    this.handleChange(e, true);
    this.unbindEventListeners();

    const shouldEnableTooltip = (e as unknown as Event)
      .composedPath()
      .find((el) => el === this.container);

    this.setState({
      showTooltip: !!shouldEnableTooltip,
      isChanging: false
    });

    this.change = null;
  };

  handleMouseEnter = () => {
    this.setState({
      showTooltip: true
    });
  };

  handleMouseLeave = () => {
    if (!this.state.isChanging) {
      this.setState({
        showTooltip: false
      });
    }
  };

  unbindEventListeners = () => {
    const contentWindow = this.props.contentWindow();

    if (contentWindow) {
      contentWindow.removeEventListener(
        "mousemove",
        this.handleChange as () => void
      );
      contentWindow.removeEventListener(
        "mouseup",
        this.handleMouseUp as () => void
      );
    }
  };

  render() {
    const { direction, rgb, Pointer } = this.props;
    const gradientAlign = direction === "vertical" ? "to top" : "to right";
    const gradientStyles = {
      background: `linear-gradient(${gradientAlign}, rgba(${rgb.r},${rgb.g},${rgb.b}, 0) 0%,
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
          <Checkboard
            renderers={this.props.renderers}
            white={"transparent"}
            grey={"rgba(0,0,0,.08)"}
            size={8}
          />
        </div>
        <div className="color-picker2-alpha-gradient" style={gradientStyles} />
        <div
          className="color-picker2-alpha-container"
          ref={(container) => (this.container = container)}
          onMouseDown={this.handleMouseDown}
          onTouchMove={this.handleChange}
          onTouchStart={this.handleChange}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          <div className="color-picker2-alpha-pointer" style={pointerStyles}>
            {Pointer ? (
              <Pointer opacity={rgb.a} showTooltip={this.state.showTooltip} />
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
