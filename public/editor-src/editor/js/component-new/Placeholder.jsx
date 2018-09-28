import React from "react";
import classnames from "classnames";
import EditorIcon from "visual/component-new/EditorIcon";

export default class Placeholder extends React.Component {
  static defaultProps = {
    className: "",
    icon: ""
  };

  render() {
    const { className: _className, icon } = this.props;
    const className = classnames("brz-shortcode__placeholder", _className);

    return (
      <div className={className}>
        <EditorIcon icon={icon} />
      </div>
    );
  }
}
