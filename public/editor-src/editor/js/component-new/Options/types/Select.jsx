import React from "react";
import _ from "underscore";
import classnames from "classnames";
import Select from "visual/component/controls/Select";
import SelectOptgroup from "visual/component/controls/Select/SelectOptgroup";
import SelectItem from "visual/component/controls/Select/SelectItem";
import EditorIcon from "visual/component-new/EditorIcon";

class SelectOptionType extends React.Component {
  static defaultProps = {
    label: "",
    display: "inline",
    className: "",
    itemHeight: 30,
    icon: "",
    choices: [],
    attr: {},
    helper: false,
    helperContent: "",
    onChange: _.noop
  };

  renderLabel() {
    const { label, helper: _helper, helperContent } = this.props;
    const helper = _helper ? (
      <div className="brz-ed-option__helper">
        <EditorIcon icon="nc-alert-circle-que" />
        <div className="brz-ed-option__helper__content">{helperContent}</div>
      </div>
    ) : null;

    return (
      <div className="brz-ed-option__label brz-ed-option__select__label">
        {label}
        {helper}
      </div>
    );
  }

  renderChoices(choices = this.props.choices) {
    return choices.map((item, index) => {
      const { title, icon: _icon, optgroup, value } = item;
      let icon;

      if (_.isObject(_icon)) {
        const iconClassName = classnames(
          "brz-control__select-option__bg",
          _icon.className
        );
        icon = <div {..._icon} className={iconClassName} />;
      } else if (_icon) {
        icon = <EditorIcon icon={_icon} />;
      }

      if (optgroup && optgroup.length) {
        return (
          <SelectOptgroup
            key={index}
            title={title}
            items={this.renderChoices(optgroup)}
          >
            {icon}
            {title && <span className="brz-span">{title}</span>}
          </SelectOptgroup>
        );
      }

      return (
        <SelectItem key={index} value={value} title={title}>
          {icon}
          {title && <span className="brz-span">{title}</span>}
        </SelectItem>
      );
    });
  }

  renderAfterSelect() {}

  render() {
    const {
      label,
      display,
      itemHeight,
      helper,
      value,
      className: _className,
      attr,
      onChange
    } = this.props;
    const className = classnames(
      "brz-ed-option__select",
      `brz-ed-option__${display}`,
      _className,
      attr.className
    );

    return (
      <div {...attr} className={className}>
        {label || helper ? this.renderLabel() : null}
        <div className="brz-d-xs-flex brz-align-items-xs-center">
          <Select
            className="brz-control__select--dark"
            defaultValue={value}
            itemHeight={itemHeight}
            onChange={onChange}
          >
            {this.renderChoices()}
          </Select>
          {this.renderAfterSelect()}
        </div>
      </div>
    );
  }
}

export default SelectOptionType;
