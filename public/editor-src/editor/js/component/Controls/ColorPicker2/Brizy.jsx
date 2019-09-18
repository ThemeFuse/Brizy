import React, { Component } from "react";
import classnames from "classnames";
import _ from "underscore";
import { Alpha, ColorWrap, Hue, Saturation } from "./common";

export class Brizy extends Component {
  renderPointer = () => <div className="color-picker2-pointer" />;

  renderPointerOpacity = ({ rgb: { a: opacity } }, showTooltip) => {
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
      disableOpacity,
      hsl,
      hsv,
      rgb,
      renderers,
      onChange
    } = this.props;

    const _className = classnames("brz-ed-control__colorPicker2", className);
    return (
      <div className={_className}>
        <div className="color-picker2-body">
          <div className="color-picker2-saturation">
            <Saturation
              hsl={hsl}
              hsv={hsv}
              contentWindow={contentWindow}
              pointer={this.renderPointer}
              onChange={onChange}
            />
          </div>
          <div className="color-picker2-hue">
            <Hue
              direction="vertical"
              hsl={hsl}
              contentWindow={contentWindow}
              pointer={this.renderPointer}
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
                pointer={this.renderPointerOpacity}
                onChange={onChange}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

Brizy.defaultProps = {
  disableOpacity: false,
  onChange: _.noop
};

export default ColorWrap(Brizy);
