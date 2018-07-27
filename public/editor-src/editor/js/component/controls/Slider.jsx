import React, { Component } from "react";
import _ from "underscore";
import classnames from "classnames";
import RCSlider, { Range } from "rc-slider";

export default class Slider extends Component {
  static defaultProps = {
    value: 100,
    min: 0,
    max: 100,
    step: 1,
    onChange: _.noop,
    onChangeEnd: _.noop
  };

  render() {
    const { value, min, max, step } = this.props;
    const className = classnames(
      "brz-ed-control__slider",
      this.props.className
    );

    return (
      <div className={className}>
        <RCSlider
          value={Number(value)}
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
