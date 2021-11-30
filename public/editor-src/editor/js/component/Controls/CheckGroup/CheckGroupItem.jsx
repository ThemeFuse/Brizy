import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "underscore";
import classnames from "classnames";
import { uuid } from "visual/utils/uuid";

export default class CheckGroupItem extends Component {
  static propTypes = {
    className: PropTypes.string,
    active: PropTypes.bool,
    value: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    renderIcons: PropTypes.func,
    divider: PropTypes.bool,
    inline: PropTypes.bool
  };

  static defaultProps = {
    className: "",
    active: false,
    value: "",
    name: "",
    divider: false,
    inline: false,
    renderIcons: _.noop,
    onClick: _.noop
  };

  renderForEdit() {
    const {
      className: _className,
      name,
      active,
      value,
      divider,
      inline,
      children,
      renderIcons,
      onClick
    } = this.props;
    const className = classnames(
      "brz-control__check-group-option",
      {
        "brz-control__check-group-option--divider": divider,
        "brz-control__check-group-option--inline": inline
      },
      { active },
      _className
    );

    return (
      <div className={className} onClick={onClick}>
        {typeof renderIcons === "function" && renderIcons({ active })}
        {children}
        <input className="brz-input" type="hidden" name={name} value={value} />
      </div>
    );
  }

  renderForView() {
    const {
      className: _className,
      active,
      name,
      value,
      required,
      renderIcons,
      divider,
      inline,
      children
    } = this.props;
    const className = classnames(
      "brz-control__check-group-option",
      {
        "brz-control__check-group-option--divider": divider,
        "brz-control__check-group-option--inline": inline
      },
      _className
    );
    const id = uuid();

    return (
      <div className={className}>
        <input
          id={id}
          className="brz-input"
          type="checkbox"
          name={name}
          value={value}
          checked={active}
          onChange={() => {}}
          required={required}
          data-type={this.props["data-type"]}
          data-label={this.props["data-label"]}
        />
        <label className="brz-label" htmlFor={id}>
          {typeof renderIcons === "function" && renderIcons()}
          {children}
        </label>
      </div>
    );
  }

  render() {
    return IS_EDITOR ? this.renderForEdit() : this.renderForView();
  }
}
