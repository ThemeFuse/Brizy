import React from "react";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import Prompts from "visual/component/Prompts";

class FormAppsOptionType extends React.Component {
  static defaultProps = {
    className: "",
    attr: {},
    icon: "nc-cog",
    value: false
  };

  handleMouseDown = event => {
    event.preventDefault();
    const { value } = this.props;

    Prompts.open({
      prompt: "form",
      mode: "single",
      props: {
        formId: value.id,
        formFields: value.fields
      }
    });
  };

  render() {
    const { className: _className, attr, icon } = this.props;
    const className = classnames(
      "brz-ed-option__button",
      _className,
      attr.className
    );

    return (
      <div {...attr} className={className} onMouseDown={this.handleMouseDown}>
        <EditorIcon icon={icon} />
      </div>
    );
  }
}

export default FormAppsOptionType;
