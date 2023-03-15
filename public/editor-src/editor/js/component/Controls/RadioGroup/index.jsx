import classnames from "classnames";
import React from "react";
import _ from "underscore";

export default class RadioGroup extends React.Component {
  static defaultProps = {
    name: "defaultName",
    className: "",
    defaultValue: "",
    onChange: _.noop
  };

  onClick = (value) => {
    this.props.onChange(value);
  };

  getCurrent = () => {
    return (
      _.find(this.props.children, (child) => {
        return child.props.value === this.props.defaultValue;
      }) || this.props.children[0]
    );
  };

  renderOptions = () => {
    return _.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        key: index,
        active: this.props.defaultValue === child.props.value,
        onClick: child.props.disabled
          ? null
          : this.onClick.bind(null, child.props.value)
      });
    });
  };

  render() {
    const { className: _className, name, defaultValue } = this.props;
    const className = classnames(
      "brz-ed-control__radio-group flex items-center",
      _className
    );
    return (
      <div className={className}>
        {this.renderOptions()}
        <div>
          <input
            className="brz-input"
            name={name}
            type="hidden"
            value={defaultValue}
          />
        </div>
      </div>
    );
  }
}
