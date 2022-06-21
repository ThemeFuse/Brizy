import React from "react";
import classnames from "classnames";
import _ from "underscore";
import EditorIcon from "visual/component/EditorIcon";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { uuid } from "visual/utils/uuid";
import Toolbar from "visual/component/Toolbar";

export default class RadioItem extends React.Component {
  static defaultProps = {
    checkIcon: "check",
    unCheckIcon: "uncheck",
    className: "",
    active: false,
    value: "",
    name: "",
    onClick: _.noop
  };

  renderForEdit() {
    const {
      active,
      className: _className,
      checkIcon,
      unCheckIcon,
      children,
      onClick,
      toolbarIcon = null
    } = this.props;
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
        {toolbarIcon ? (
          <Toolbar {...toolbarIcon}>
            <EditorIcon
              className={iconClassName}
              icon={active ? `nc-${checkIcon}` : `nc-${unCheckIcon}`}
            />
          </Toolbar>
        ) : (
          <EditorIcon
            className={iconClassName}
            icon={active ? `nc-${checkIcon}` : `nc-${unCheckIcon}`}
          />
        )}
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
      checkIcon,
      unCheckIcon,
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
            name={checkIcon}
          />
          <ThemeIcon
            className="brz-control__radio-icon brz-control__radio--uncheck"
            type="editor"
            name={unCheckIcon}
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
