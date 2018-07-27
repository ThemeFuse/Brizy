import React from "react";
import _ from "underscore";
import classnames from "classnames";
import Select from "visual/component/controls/Select";
import SelectItem from "visual/component/controls/Select/SelectItem";
import EditorIcon from "visual/component-new/EditorIcon";

class SelectOptionType extends React.Component {
  static defaultProps = {
    label: "",
    display: "inline",
    className: "",
    itemHeight: 30,
    icon: null,
    choices: [],
    attr: {},
    helper: false,
    helperContent: "",
    onChange: _.noop
  };

  renderLabel = () => {
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
  };

  renderChoices = () => {
    return this.props.choices.map((item, index) => {
      const { title, icon, value } = item;

      return (
        <SelectItem key={index} value={value} title={title}>
          {icon && <EditorIcon icon={icon} />}
          <span className="brz-span">{title}</span>
        </SelectItem>
      );
    });
  };

  renderAfterSelect = () => {};

  render() {
    const {
      label,
      display,
      itemHeight,
      helper,
      value,
      onChange,
      className: _className,
      attr: _attr
    } = this.props;
    const className = classnames(
      "brz-ed-option__select",
      `brz-ed-option__${display}`,
      _className,
      _attr.className
    );
    const attr = _.omit(_attr, "className");

    return (
      <div className={className} {...attr}>
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
