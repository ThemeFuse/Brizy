import React from "react";
import classnames from "classnames";
import _ from "underscore";
import EditorIcon from "visual/component/EditorIcon";
import ThemeIcon from "visual/component/ThemeIcon";
import { uuid } from "visual/utils/uuid";

export default class RadioItem extends React.Component {
  static defaultProps = {
    className: "",
    active: false,
    value: "",
    name: "",
    onClick: _.noop
  };

  renderForEdit() {
    const { active, className: _className, children, onClick } = this.props;
    const className = classnames(
      "brz-control__radio-option",
      { "brz-control__radio-option--active": active },
      _className
    );
    const iconClassName = classnames("brz-control__radio-check", {
      "brz-control__radio-check--active": active
    });

    return (
      <div className={className} onClick={onClick}>
        <EditorIcon
          className={iconClassName}
          icon={active ? "nc-check" : "nc-uncheck"}
        />
        {children}
      </div>
    );
  }

  renderForView() {
    const {
      active,
      className: _className,
      value,
      name,
      required,
      children,
      onClick
    } = this.props;
    const className = classnames(
      "brz-control__radio-option",
      { "brz-control__radio-option--active": active },
      _className
    );
    const id = uuid();

    return (
      <div className={className} onClick={onClick}>
        <input
          id={id}
          className="brz-input"
          type="radio"
          name={name}
          value={value}
          checked={active}
          required={required}
          data-type={this.props["data-type"]}
          data-label={this.props["data-label"]}
          onChange={() => {}}
        />
        <label className="brz-label" htmlFor={id}>
          <ThemeIcon
            className="brz-control__radio-icon brz-control__radio--check"
            type="editor"
            name="check"
          />
          <ThemeIcon
            className="brz-control__radio-icon brz-control__radio--uncheck"
            type="editor"
            name="uncheck"
          />
          {children}
        </label>
      </div>
    );
  }

  render() {
    return IS_EDITOR ? this.renderForEdit() : this.renderForView();
  }
}
