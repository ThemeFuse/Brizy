import React from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import IconSetter from "visual/component/Controls/IconSetter";

class IconSetterOption extends React.Component {
  static defaultProps = {
    label: "",
    className: "",
    attr: {},
    helper: false,
    helperContent: "",
    canDelete: false,
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
      value,
      helper,
      onChange,
      canDelete,
    } = this.props;
    const className = classnames(
      "brz-ed-option__icon-setter",
      "brz-ed-option__inline",
      _className,
      _attr.className
    );
    const attr = _.omit(_attr, "className");

    return (
      <div className={className} {...attr}>
        {label || helper ? this.renderLabel() : null}
        <IconSetter value={value} onChange={onChange} canDelete={canDelete} />
      </div>
    );
  }
}

export default IconSetterOption;
