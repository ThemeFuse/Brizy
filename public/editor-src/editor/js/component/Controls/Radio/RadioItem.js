import classnames from "classnames";
import { noop } from "es-toolkit";
import React from "react";
import EditorIcon from "visual/component/EditorIcon";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { uuid } from "visual/utils/uuid";

export default class RadioItem extends React.Component {
  static defaultProps = {
    checkIcon: "check",
    unCheckIcon: "uncheck",
    className: "",
    active: false,
    value: "",
    name: "",
    onClick: noop
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
      onClick,
      type,
      label
    } = this.props;
    const className = classnames(
      "brz-control__radio-option",
      { "brz-control__radio-option--active": active },
      _className
    );
    const uidPlaceholder = makePlaceholder({
      content: "{{ random_id }}",
      attr: { key: name }
    });
    const labelId = `${uuid()}_${uidPlaceholder}`;

    return (
      <div className={className} onClick={onClick}>
        <input
          id={labelId}
          className="brz-input"
          type="radio"
          name={name}
          value={value}
          checked={active}
          required={required}
          {...makeDataAttr({
            name: "type",
            value: type
          })}
          {...makeDataAttr({
            name: "label",
            value: label
          })}
          onChange={() => {}}
        />
        <label className="brz-label" htmlFor={labelId}>
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
    const { isEditor } = this.props;

    return isEditor ? this.renderForEdit() : this.renderForView();
  }
}
