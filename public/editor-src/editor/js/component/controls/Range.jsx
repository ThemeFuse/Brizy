import React, { Component } from "react";
import _ from "underscore";
import classnames from "classnames";
import RCSlider from "rc-slider";

const RCRange = RCSlider.Range;

export default class Range extends Component {
  static defaultProps = {
    min: 0,
    max: 100,
    step: 1,
    startPointer: 0,
    finishPointer: 100,
    allowCross: false,
    handle: null,
    railStyle: {},
    onChange: _.noop
  };

  render() {
    const {
      className: _className,
      min,
      max,
      step,
      startPointer,
      finishPointer,
      allowCross,
      handle,
      railStyle,
      onChange
    } = this.props;
    const className = classnames("brz-ed-control__range", _className);

    return (
      <div className={className}>
        <RCRange
          count={1}
          defaultValue={[startPointer, finishPointer]}
          min={min}
          max={max}
          step={step}
          allowCross={allowCross}
          handle={handle}
          railStyle={railStyle}
          onChange={onChange}
        />
      </div>
    );
  }
}
