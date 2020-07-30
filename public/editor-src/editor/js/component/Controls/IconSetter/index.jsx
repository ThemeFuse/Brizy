import React from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import ThemeIcon from "visual/component/ThemeIcon";
import Prompts from "visual/component/Prompts";

export default class IconSetter extends React.Component {
  static defaultProps = {
    className: "",
    canDelete: false,
    value: {},
    onChange: _.noop
  };

  handleClick = () => {
    const { value, onChange } = this.props;

    Prompts.open({
      prompt: "icon",
      mode: "single",
      props: {
        onChange,
        name: value.name,
        type: value.type
      }
    });
  };

  handleRemove = () => {
    this.props.onChange({
      name: "",
      type: ""
    });
  };

  renderSelectIcon = () => {
    return (
      <div
        className="brz-ed-control__icon-setter__box"
        onClick={this.handleClick}
      >
        <EditorIcon icon="nc-add" />
      </div>
    );
  };

  renderRemoveIcon = () => {
    return this.props.canDelete ? (
      <div
        key="second"
        className="brz-ed-control__focal-point__delete"
        onClick={this.handleRemove}
      >
        <EditorIcon icon="nc-circle-remove" />
      </div>
    ) : null;
  };

  renderIcon = () => {
    const { name, type } = this.props.value;

    return [
      <div
        key="first"
        className="brz-ed-control__icon-setter__box"
        onClick={this.handleClick}
      >
        <div className="brz-ed-control__icon-setter--active">
          <ThemeIcon className="grid-16 stroke-2" name={name} type={type} />
        </div>
      </div>,
      this.renderRemoveIcon()
    ];
  };

  render() {
    const { name } = this.props.value;
    const className = classnames(
      "brz-ed-control__icon-setter",
      this.props.className
    );

    return (
      <div className={className}>
        {name ? this.renderIcon() : this.renderSelectIcon()}
      </div>
    );
  }
}
