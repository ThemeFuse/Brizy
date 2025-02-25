import classnames from "classnames";
import { noop } from "es-toolkit";
import React, { Component, ReactElement } from "react";
import {
  ChangeFunction,
  OnSwatchHover
} from "visual/component/Controls/ColorPicker2/types";
import { Alpha, ColorWrap, Hue, Saturation } from "./common";

import HSLA = tinycolor.ColorFormats.HSLA;
import HSVA = tinycolor.ColorFormats.HSVA;
import RGBA = tinycolor.ColorFormats.RGBA;

export interface Props {
  domRef?: (r: HTMLDivElement | null) => void;
  color?: string;
  opacity?: number;
  disableOpacity?: boolean;
  contentWindow: () => Window | null;
  onChange: ChangeFunction;
  className?: string;
  hsl: HSLA;
  hsv: HSVA;
  rgb: RGBA;
  renderers?: { canvas: new () => HTMLCanvasElement };
  onSwatchHover?: OnSwatchHover;
}

type PointerProps = {
  opacity: number;
  showTooltip: boolean;
};

class Brizy extends Component<Props> {
  renderPointer = (): ReactElement => <div className="color-picker2-pointer" />;

  renderPointerOpacity = ({
    opacity,
    showTooltip
  }: PointerProps): ReactElement => {
    opacity *= 100;

    return (
      <div className="color-picker2-pointer">
        {showTooltip && (
          <div className="color-picker2-pointer-tooltip">
            {Math.round(opacity)}%
          </div>
        )}
      </div>
    );
  };

  render() {
    const {
      className,
      contentWindow,
      disableOpacity = false,
      hsl,
      hsv,
      rgb,
      renderers = {},
      onChange = noop
    } = this.props;

    const _className = classnames(
      "brz-ed-control__legacy-colorPicker2",
      className
    );
    return (
      <div className={_className} ref={this.props.domRef}>
        <div className="color-picker2-body">
          <div className="color-picker2-saturation">
            <Saturation
              hsl={hsl}
              hsv={hsv}
              contentWindow={contentWindow}
              Pointer={this.renderPointer}
              onChange={onChange}
            />
          </div>
          <div className="color-picker2-hue">
            <Hue
              direction="vertical"
              hsl={hsl}
              contentWindow={contentWindow}
              Pointer={this.renderPointer}
              onChange={onChange}
            />
          </div>
          {!disableOpacity && (
            <div className="color-picker2-alpha">
              <Alpha
                direction="vertical"
                rgb={rgb}
                hsl={hsl}
                contentWindow={contentWindow}
                renderers={renderers}
                Pointer={this.renderPointerOpacity}
                onChange={onChange}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const _Brizy = ColorWrap(Brizy);

export default _Brizy;
