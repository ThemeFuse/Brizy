import classnames from "classnames";
import { noop } from "es-toolkit";
import RCSlider from "rc-slider";
import React, { Component } from "react";

export default class Slider extends Component {
  static defaultProps = {
    value: 100,
    min: 0,
    max: 100,
    step: 1,
    onChange: noop,
    onChangeEnd: noop
  };

  render() {
    const { className: _className, value, min, max, step } = this.props;
    const className = classnames("brz-ed-control__slider", _className);

    return (
      <div className={className}>
        <RCSlider
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={this.props.onChange}
          onAfterChange={this.props.onChangeEnd}
        />
      </div>
    );
  }
}
