import React from "react";
import _ from "underscore";
import classnames from "classnames";
import RCSlider from "rc-slider";
import Range from "visual/component/Controls/Range";

const RCHandle = RCSlider.Handle;

class RangeOptionType extends React.Component {
  static defaultProps = {
    className: "",
    attr: {},
    config: {
      range: {
        min: 0,
        max: 100,
        step: 1
      }
    },
    value: {
      startPointer: 0,
      finishPointer: 100,
      activePointer: "startPointer",
      bgColorHex: "#000000",
      gradientColorHex: "#000000"
    },
    onChange: _.noop
  };

  constructor(props) {
    super(props);
    const value = props.value;
    this.state = { ...value };
  }

  handleOnMouseDown = index => {
    const activePointer = index === 0 ? "startPointer" : "finishPointer";
    this.handleChange({ activePointer });
  };

  handleRangeChange = value => {
    this.handleChange({ startPointer: value[0], finishPointer: value[1] });
  };

  handleChange = value => {
    const oldValue = this.state;
    const newValue = { ...oldValue, ...value };

    this.setState(newValue);
    this.props.onChange(newValue);
  };

  handle = props => {
    /* eslint-disable no-unused-vars */
    const {
      className: _className,
      dragging,
      value,
      index,
      ...restProps
    } = props;
    /* eslint-enabled no-unused-vars */
    const className = classnames(_className, {
      "brz-ed-rc-slider-handle--active":
        (this.state.activePointer === "startPointer" && index === 0) ||
        (this.state.activePointer === "finishPointer" && index === 1)
    });

    return (
      <RCHandle
        key={index}
        value={value}
        onMouseDown={() => this.handleOnMouseDown(index)}
        {...restProps}
        className={className}
      />
    );
  };

  render() {
    const {
      className: _className,
      config: {
        range: { min, max, step }
      },
      attr: _attr
    } = this.props;

    const className = classnames(
      "brz-ed-option__range",
      _className,
      _attr.className
    );
    const attr = _.omit(_attr, "className");
    const {
      startPointer,
      finishPointer,
      bgColorHex,
      gradientColorHex
    } = this.state;

    return (
      <div className={className} {...attr}>
        <div className="brz-ed-option__range__content">
          <Range
            id={this.props.id}
            min={min}
            max={max}
            step={step}
            startPointer={startPointer}
            finishPointer={finishPointer}
            handle={this.handle}
            railStyle={{
              backgroundImage: `linear-gradient(to right, ${bgColorHex}, ${gradientColorHex})`
            }}
            onChange={this.handleRangeChange}
          />
        </div>
      </div>
    );
  }
}

export default RangeOptionType;
