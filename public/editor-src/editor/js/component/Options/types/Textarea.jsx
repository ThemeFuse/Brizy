import React from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";

class TextareaOptionType extends React.Component {
  static defaultProps = {
    className: "",
    label: "",
    placeholder: "",
    helper: false,
    helperContent: "",
    attr: {},
    value: "",
    onChange: _.noop
  };

  onChangeDebounced = _.debounce(value => {
    this.props.onChange(value);
  }, 1000);

  handleChance = e => {
    this.onChangeDebounced(e.target.value);
  };

  handleFocus = () => {
    this.textarea.focus();
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
      <div className="brz-ed-option__label brz-ed-option__textarea__label">
        {label}
        {helper}
      </div>
    );
  };

  render() {
    const {
      label,
      className: _className,
      helper,
      placeholder,
      attr: _attr,
      value
    } = this.props;

    const className = classnames(
      "brz-ed-option__textarea",
      "brz-ed-option__inline",
      _className,
      _attr.className
    );
    const attr = _.omit(_attr, "className");

    return (
      <div className={className} {...attr}>
        {label || helper ? this.renderLabel() : null}
        <textarea
          ref={el => {
            this.textarea = el;
          }}
          type="text"
          className="brz-textarea brz-ed-control__textarea"
          placeholder={placeholder}
          defaultValue={value}
          onClick={this.handleFocus}
          onChange={this.handleChance}
        />
      </div>
    );
  }
}

export default TextareaOptionType;
