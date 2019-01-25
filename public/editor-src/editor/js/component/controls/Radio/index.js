import _ from "underscore";
import React from "react";
import classnames from "classnames";

export default class Radio extends React.Component {
  static defaultProps = {
    name: "defaultName",
    defaultValue: "",
    onChange: _.noop
  };

  state = {
    currentValue: this.props.defaultValue
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.defaultValue !== nextProps.defaultValue) {
      this.setState({
        currentValue: nextProps.defaultValue
      });
    }
  }

  onItemClick = value => {
    this.setState({
      currentValue: value
    });
    this.props.onChange(value);
  };

  getCurrent = () => {
    return (
      _.find(this.props.children, child => {
        return child.props.value === this.state.currentValue;
      }) || this.props.children[0]
    );
  };

  renderOptions() {
    return React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        key: index,
        active: this.state.currentValue === child.props.value,
        onClick: child.props.disabled
          ? null
          : this.onItemClick.bind(null, child.props.value)
      });
    });
  }

  render() {
    const { className: _className, name, currentValue } = this.props;
    const className = classnames("brz-ed-control-radio", _className);

    return (
      <div className={className}>
        {this.renderOptions()}
        <div>
          <input
            className="brz-input"
            name={name}
            type="hidden"
            value={currentValue}
          />
        </div>
      </div>
    );
  }
}
