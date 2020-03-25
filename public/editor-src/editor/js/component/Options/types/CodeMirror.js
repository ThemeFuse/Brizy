import React from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import Tooltip from "visual/component/Controls/Tooltip";

// CodeMirror plugin doesn't work on SSR.Therefore we have used 'require'
let CodeMirror;
if (IS_EDITOR) {
  CodeMirror = require("react-codemirror");
  require("codemirror/addon/display/placeholder");
  require("codemirror/mode/css/css");
}

class CodeMirrorOptionType extends React.Component {
  static defaultProps = {
    className: "",
    label: "",
    placeholder: "",
    helper: false,
    helperContent: "",
    attr: {},
    display: "inline",
    lineNumbers: false,
    value: "",
    onChange: _.noop
  };

  state = {
    value: ""
  };

  lastUpdatedValue = "";

  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };
  }

  onChange = value => this.setState({ value }, this.onChangeDebounced);

  onChangeDebounced = _.debounce(() => {
    this.props.onChange(this.state.value);
    this.lastUpdatedValue = this.state.value;
  }, 1000);

  componentWillReceiveProps({ value }) {
    if (value !== this.lastUpdatedValue) {
      if (this.state.value !== this.lastUpdatedValue) {
        this.onChangeDebounced.cancel();
        this.props.onChange(this.state.value);
        this.lastUpdatedValue = this.state.value;
      }
      this.setState({ value });
    }
  }

  renderLabel() {
    const { label, helper: _helper, helperContent } = this.props;
    const helper = _helper ? (
      <div className="brz-ed-option__helper">
        <Tooltip
          placement="bottom-center"
          openOnClick={false}
          overlay={
            <div
              className="brz-ed-option__helper__content"
              dangerouslySetInnerHTML={{ __html: helperContent }}
            />
          }
        >
          <EditorIcon icon="nc-alert-circle-que" />
        </Tooltip>
      </div>
    ) : null;

    return (
      <div className="brz-ed-option__label brz-ed-option__code__label">
        {label}
        {helper}
      </div>
    );
  }

  render() {
    const {
      label,
      className: _className,
      helper,
      display,
      lineNumbers,
      attr: _attr,
      placeholder
    } = this.props;

    const className = classnames(
      "brz-ed-option__code",
      `brz-ed-option__${display}`,
      _className,
      _attr.className
    );
    const attr = _.omit(_attr, "className");

    const options = {
      lineNumbers,
      tabSize: 2,
      placeholder,
      mode: "css"
    };

    return (
      <div className={className} {...attr}>
        {label || helper ? this.renderLabel() : null}
        {IS_EDITOR && (
          <CodeMirror
            value={this.state.value}
            onChange={this.onChange}
            options={options}
          />
        )}
      </div>
    );
  }
}

export default CodeMirrorOptionType;
