import { debounce } from "es-toolkit";
import React, { Component, ComponentType, MouseEvent, TouchEvent } from "react";
import {
  ChangeFunction,
  HSLAChange,
  HSVAChange,
  OnSwatchHover
} from "visual/component/Controls/ColorPicker2/types";
import { GlobalMeta } from "visual/component/Controls/types";
import { Props as PickerProps } from "../Brizy";
import color from "../helpers/color";

import HSVA = tinycolor.ColorFormats.HSVA;
import HSLA = tinycolor.ColorFormats.HSLA;
import RGBA = tinycolor.ColorFormats.RGBA;

export interface Props {
  color?: string;
  contentWindow: () => Window | null;
  disableOpacity?: boolean;
  domRef: (r: HTMLDivElement | null) => void;
  onChange: ChangeFunction;
  onChangeComplete?: ChangeFunction;
  opacity: number;
  onSwatchHover?: OnSwatchHover;
}

interface State {
  hsl: HSLA;
  hex: string;
  rgb: RGBA;
  oldHue: number;
  source: string;
  hsv: HSVA;
  prevColor: Props["color"];
}

export const ColorWrap = (Picker: ComponentType<PickerProps>) => {
  class ColorPicker extends Component<Props, State> {
    private debounce: ((
      fn: Props["onChange"],
      data: HSLAChange | HSVAChange,
      meta?: GlobalMeta
    ) => void) &
      _.Cancelable;
    constructor(props: Props) {
      super(props);

      this.state = {
        ...color.toState(props.color ?? "", 0),
        prevColor: props.color
      };

      this.debounce = debounce(
        (
          fn: Props["onChange"],
          data: HSLAChange | HSVAChange,
          meta?: GlobalMeta
        ) => {
          fn(data, meta);
        },
        100
      );
    }

    static getDerivedStateFromProps(nextProps: Props, state: State) {
      if (state.prevColor !== nextProps.color) {
        return {
          ...color.toState(nextProps.color ?? "", state.oldHue),
          prevColor: nextProps.color
        };
      }

      return null;
    }

    handleChange = (data: HSVAChange | HSLAChange, meta?: GlobalMeta) => {
      const isValidColor = color.simpleCheckForValidColor(data);
      if (isValidColor) {
        const colors = color.toState(
          data,
          data.h || this.state.oldHue,
          data.hsv || this.state.hsv
        );
        this.setState(colors);
        this.props.onChangeComplete &&
          // @ts-expect-error no HSV or HSL here
          this.debounce(this.props.onChangeComplete, colors, meta);

        this.props.onChange &&
          this.props.onChange(
            // @ts-expect-error no HSV or HSL here
            {
              ...colors,
              wasChanged: data.wasChanged
            },
            meta
          );
      }
    };

    handleSwatchHover = (
      data: HSLAChange | HSVAChange,
      event: MouseEvent | TouchEvent
    ) => {
      const isValidColor = color.simpleCheckForValidColor(data);
      if (isValidColor) {
        const colors = color.toState(
          data,
          data.h || this.state.oldHue,
          data.hsv || this.state.hsv
        );
        this.setState(colors);
        // @ts-expect-error to HSV or HSL
        this.props.onSwatchHover && this.props.onSwatchHover(colors, event);
      }
    };

    render() {
      const optionalEvents: {
        onSwatchHover?: (
          data: HSLAChange | HSVAChange,
          e: MouseEvent | TouchEvent
        ) => void;
      } = {};
      if (this.props.onSwatchHover) {
        optionalEvents.onSwatchHover = this.handleSwatchHover;
      }

      return (
        <Picker
          contentWindow={this.props.contentWindow}
          hsl={this.state.hsl}
          hsv={this.state.hsv}
          rgb={this.state.rgb}
          domRef={this.props.domRef}
          color={this.props.color}
          opacity={this.props.opacity}
          disableOpacity={this.props.disableOpacity}
          onSwatchHover={this.props.onSwatchHover}
          onChange={this.handleChange}
          {...optionalEvents}
        />
      );
    }
  }

  return ColorPicker;
};

export default ColorWrap;
