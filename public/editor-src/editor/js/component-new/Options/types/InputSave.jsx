import React from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component-new/EditorIcon";
import Input from "./common/Input";

class InputSaveOptionType extends React.Component {
  static defaultProps = {
    className: "",
    attr: {},
    icon: "nc-circle-remove",
    value: "",
    onChange: _.noop
  };

  state = {
    value: this.props.value
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value
    });
  }

  handleDelete = () => {
    this.setState({ value: "" });
    this.props.onChange("");
  };

  handleSave = () => {
    const value = this.state.value;
    if (value) {
      this.props.toolbar.resetItemsRenderer();
      this.props.onChange(value);
    }
  };

  handleInputChange = value => {
    this.setState({ value });
  };

  renderDeleteIcon = () => {
    if (String(this.state.value)) {
      return (
        <div className="brz-ed-toolbar__link__icon" onClick={this.handleDelete}>
          <EditorIcon icon={this.props.icon} />
        </div>
      );
    }
  };

  renderSaveIcon = () => {
    const { value } = this.state;
    const className = classnames("brz-ed-toolbar__link--save", {
      "brz-ed-toolbar--active": value.length > 0
    });

    return (
      <div className={className} onClick={this.handleSave}>
        <EditorIcon icon="nc-arrow-right" />
      </div>
    );
  };

  render() {
    const { value } = this.state;
    const { className: _className, attr: _attr, icon } = this.props;
    const className = classnames(
      "brz-ed-toolbar__link__custom",
      _className,
      _attr.className
    );
    const attr = _.omit(_attr, "className");

    return (
      <div className={className} {...attr}>
        <div className="brz-ed-toolbar__link__title">
          <Input
            placeholder="Enter an URL"
            className="brz-ed-toolbar__link__input"
            value={value}
            onChange={this.handleInputChange}
            onEnterKeyDown={this.handleSave}
          />
        </div>
        {icon ? this.renderDeleteIcon() : null}
        {this.renderSaveIcon()}
      </div>
    );
  }
}

export default InputSaveOptionType;
