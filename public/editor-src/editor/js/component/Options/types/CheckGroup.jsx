import React from "react";
import PropTypes from "prop-types";
import _ from "underscore";
import classnames from "classnames";
import CheckGroup from "visual/component/Controls/CheckGroup";
import CheckGroupItem from "visual/component/Controls/CheckGroup/CheckGroupItem";
import EditorIcon from "visual/component/EditorIcon";

class CheckGroupOptionType extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    display: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string,
    helper: PropTypes.bool,
    helperContent: PropTypes.string,
    attr: PropTypes.object,
    choices: PropTypes.array.isRequired,
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    label: "",
    display: "inline",
    icon: "",
    title: "",
    className: "",
    value: {},
    helper: false,
    helperContent: "",
    attr: {},
    choices: [],
    onChange: _.noop
  };

  renderLabel() {
    const { label, helper: _helper, helperContent } = this.props;
    const helper = _helper ? (
      <div className="brz-ed-option__helper">
        <EditorIcon icon="nc-alert-circle-que" />
        <div
          className="brz-ed-option__helper__content"
          dangerouslySetInnerHTML={{ __html: helperContent }}
        />
      </div>
    ) : null;

    return (
      <div className="brz-ed-option__label brz-ed-option__check-group__label">
        {label}
        {helper}
      </div>
    );
  }

  renderChoices() {
    const { choices } = this.props;

    return choices.map(({ value, title, icon }) => {
      const className = classnames({
        "brz-ed-option__check-group--boxed": icon
      });

      return (
        <CheckGroupItem
          key={value}
          className={className}
          name={title || icon}
          value={value}
        >
          {icon && (
            <div className="brz-ed-option__check-group__icon">
              <EditorIcon icon={icon} />
            </div>
          )}
          {title && (
            <div className="brz-ed-option__check-group__title">{title}</div>
          )}
        </CheckGroupItem>
      );
    });
  }

  render() {
    const {
      label,
      display,
      className: _className,
      helper,
      attr,
      value,
      onChange
    } = this.props;

    const className = classnames(
      "brz-ed-option__check-group",
      `brz-ed-option__${display}`,
      _className,
      attr.className
    );

    return (
      <div {...attr} className={className}>
        {label || helper ? this.renderLabel() : null}
        <CheckGroup defaultValue={value} onChange={onChange}>
          {this.renderChoices()}
        </CheckGroup>
      </div>
    );
  }
}

export default CheckGroupOptionType;
