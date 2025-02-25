import classnames from "classnames";
import { noop } from "es-toolkit";
import React from "react";
import AutoCorrectingInput from "visual/component/Controls/AutoCorrectingInput";
import EditorIcon from "visual/component/EditorIcon";

class MultiInputOptionType extends React.Component {
  static defaultProps = {
    className: "",
    display: "inline",
    config: {
      defaultIcon: null,
      icons: ["nc-settings"]
    },
    min: -9999,
    max: 9999,
    step: 1,
    value: null,
    attr: {},
    onChange: noop
  };

  state = {
    activeIcon: this.getInitialIcon(),
    focusedIcon: 0,
    focused: false
  };

  getInitialIcon() {
    const { defaultIcon, icons } = this.props.config;

    return defaultIcon || icons[0];
  }

  handleInputValueChange = (index, v) => {
    const { value, onChange } = this.props;
    const updated = value.map((v_, index_) => (index_ === index ? v : v_));

    onChange(updated);
  };

  handleMouseEnter(index) {
    const { icons } = this.props.config;

    this.setState({
      activeIcon: icons[index]
    });
  }

  handleMouseLeave() {
    const { icons } = this.props.config;
    const { focusedIcon, focused } = this.state;
    this.setState({
      activeIcon: focused ? icons[focusedIcon] : this.getInitialIcon()
    });
  }

  onFocus(index) {
    const { icons } = this.props.config;

    this.setState({
      activeIcon: icons[index],
      focusedIcon: index,
      focused: true
    });
  }

  onBlur(index) {
    this.setState({
      activeIcon: this.getInitialIcon(),
      focusedIcon: index,
      focused: false
    });
  }

  render() {
    const {
      className: _className,
      attr,
      min,
      max,
      step,
      value,
      display
    } = this.props;
    const { activeIcon } = this.state;

    const className = classnames(
      "brz-ed-option__input-outline",
      "brz-ed-option__multi-input",
      `brz-ed-option__${display}`,
      "brz-ed-option__input-number-wrap",
      _className,
      attr.className
    );

    const inputs = value.map((v, index) => (
      <div
        key={index}
        className="brz-ed-option__multi-input-container"
        onMouseEnter={() => this.handleMouseEnter(index)}
        onMouseLeave={() => this.handleMouseLeave(index)}
      >
        <AutoCorrectingInput
          className="brz-input"
          min={min}
          max={max}
          step={step}
          value={v}
          onFocus={() => this.onFocus(index)}
          onBlur={() => this.onBlur(index)}
          onChange={(v) => this.handleInputValueChange(index, v)}
        />
      </div>
    ));

    return (
      <div className={className} {...attr}>
        <EditorIcon icon={activeIcon} className="brz-icon" />
        {inputs}
      </div>
    );
  }
}

export default MultiInputOptionType;
