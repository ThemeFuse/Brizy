import React from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component-new/EditorIcon";

const getDecimalLength = num => {
  const decimal = num.toString().split(".");
  return decimal && decimal[1] ? decimal[1].length : 0;
};

const round = (num, depth) => {
  if (depth > 0) {
    const decimal = Math.pow(10, depth);
    return Math.round(num * decimal) / decimal;
  }
  return Number(num);
};

export default class Stepper extends React.Component {
  static defaultProps = {
    className: "",
    arrowUp: "nc-stre-up",
    arrowDown: "nc-stre-down",
    step: 1,
    max: 10,
    min: 0,
    value: 1,
    onChange: _.noop
  };

  onClick = state => {
    const { min, max, step, value, onChange } = this.props;
    const _min = Number(min);
    const _max = Number(max);
    const _step = Number(step);
    const _value = Number(value);

    if (state === "increment" && _value + _step <= _max) {
      const newValue = round(_value + _step, getDecimalLength(_step));
      onChange(newValue);
    } else if (state === "decrement" && _value - _step >= _min) {
      const newValue = round(_value - _step, getDecimalLength(_step));
      onChange(newValue);
    }
  };

  render() {
    const {
      className: _className,
      arrowUp,
      arrowDown,
      step,
      max,
      min,
      value
    } = this.props;
    const _step = Number(step);
    const _max = Number(max);
    const _min = Number(min);
    const _value = Number(value).toFixed(getDecimalLength(_step));

    const className = classnames(
      "brz-ed-control__stepper",
      {
        "brz-ed-control__stepper--inactive": _value >= _max || _value <= _min
      },
      _className
    );
    return (
      <div className={className}>
        <div className="brz-ed-control__stepper--value">{_value}</div>
        <div className="brz-ed-control__stepper--arrows">
          <div
            className="brz-ed-control__stepper--up"
            onClick={this.onClick.bind(null, "increment")}
          >
            <EditorIcon icon={arrowUp} />
          </div>
          <div
            className="brz-ed-control__stepper--down"
            onClick={this.onClick.bind(null, "decrement")}
          >
            <EditorIcon icon={arrowDown} />
          </div>
        </div>
      </div>
    );
  }
}
