import React from "react";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import ThemeIcon from "visual/component/ThemeIcon";

export default class Placeholder extends React.Component {
  static defaultProps = {
    className: "",
    icon: ""
  };

  renderForEdit() {
    const { className: _className, icon } = this.props;
    const className = classnames("brz-shortcode__placeholder", _className);

    return (
      <div className={className}>
        <EditorIcon icon={icon} />
      </div>
    );
  }

  renderForView() {
    const { className: _className, icon } = this.props;
    const className = classnames("brz-shortcode__placeholder", _className);

    return (
      <div className={className}>
        <ThemeIcon name={icon} type="editor" />
      </div>
    );
  }

  render() {
    return IS_EDITOR ? this.renderForEdit() : this.renderForView();
  }
}
