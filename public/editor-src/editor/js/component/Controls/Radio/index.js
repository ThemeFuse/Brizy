import classnames from "classnames";
import { noop } from "es-toolkit";
import { find } from "es-toolkit/compat";
import React from "react";
import { RenderFor } from "visual/providers/RenderProvider/RenderFor";

export { default as RadioItem } from "./RadioItem";

export default class Radio extends React.Component {
  static defaultProps = {
    name: "defaultName",
    defaultValue: "",
    onChange: noop
  };

  state = {
    currentValue: this.props.defaultValue
  };

  onItemClick = (value) => {
    this.setState({
      currentValue: value
    });
    this.props.onChange(value);
  };

  getCurrent = () => {
    return (
      find(this.props.children, (child) => {
        return child.props.value === this.state.currentValue;
      }) || this.props.children[0]
    );
  };

  renderOptions(renderContext) {
    return React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        key: index,
        active: this.state.currentValue === child.props.value,
        name: this.props.name,
        renderContext,
        onClick: child.props.disabled
          ? null
          : this.onItemClick.bind(null, child.props.value)
      });
    });
  }

  renderForEdit() {
    const { className: _className, name } = this.props;
    const { currentValue } = this.state;

    const className = classnames("brz-control__radio", _className);

    return (
      <div className={className}>
        {this.renderOptions("editor")}
        <input
          className="brz-input"
          name={name}
          type="hidden"
          value={currentValue}
        />
      </div>
    );
  }

  renderForView() {
    const className = classnames("brz-control__radio", this.props.className);

    return (
      <div className={className} data-value={this.state.currentValue}>
        {this.renderOptions("view")}
      </div>
    );
  }

  render() {
    return (
      <RenderFor
        forView={this.renderForView()}
        forEdit={this.renderForEdit()}
      />
    );
  }
}
