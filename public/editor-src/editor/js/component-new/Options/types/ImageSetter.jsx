import React from "react";
import _ from "underscore";
import classnames from "classnames";
import ImageSetter from "visual/component/controls/ImageSetter";
import EditorIcon from "visual/component-new/EditorIcon";

class FocalPointOptionType extends React.Component {
  static defaultProps = {
    label: "",
    className: "",
    attr: {},
    helper: false,
    helperContent: "",
    onlyPointer: false,
    display: "inline",
    value: {},
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
      <div className="brz-ed-option__label brz-ed-option__focal-point__label">
        {label}
        {helper}
      </div>
    );
  };

  render() {
    const {
      className: _className,
      label,
      attr: _attr,
      display,
      value,
      onlyPointer,
      helper,
      onChange
    } = this.props;
    const className = classnames(
      "brz-ed-option__focal-point",
      `brz-ed-option__${display}`,
      _className,
      _attr.className
    );
    const attr = _.omit(_attr, "className");

    return (
      <div className={className} {...attr}>
        {label || helper ? this.renderLabel() : null}
        <ImageSetter onlyPointer={onlyPointer} {...value} onChange={onChange} />
      </div>
    );
  }
}

export default FocalPointOptionType;
