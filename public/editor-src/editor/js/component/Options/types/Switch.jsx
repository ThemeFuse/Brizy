import React from "react";
import _ from "underscore";
import classnames from "classnames";
import SwitchControl from "visual/component/Controls/Switch";
import EditorIcon from "visual/component/EditorIcon";

class SwitchOptionType extends React.Component {
  static defaultProps = {
    label: "",
    display: "inline",
    className: "",
    value: "off",
    valueMap: {
      true: "on",
      false: "off"
    },
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
        <div
          className="brz-ed-option__helper__content"
          dangerouslySetInnerHTML={{ __html: helperContent }}
        />
      </div>
    ) : null;

    return (
      <div className="brz-ed-option__label brz-ed-option__switch__label">
        {label}
        {helper}
      </div>
    );
  };

  render() {
    const {
      label,
      display,
      helper,
      value,
      valueMap,
      attr,
      className: _className,
      onChange
    } = this.props;
    const className = classnames(
      "brz-ed-option__switch",
      `brz-ed-option__${display}`,
      _className,
      attr.className
    );

    return (
      <div {...attr} className={className}>
        {label || helper ? this.renderLabel(label) : null}
        <SwitchControl
          key={value}
          defaultValue={value}
          valueMap={valueMap}
          onChange={onChange}
        />
      </div>
    );
  }
}

export default SwitchOptionType;
