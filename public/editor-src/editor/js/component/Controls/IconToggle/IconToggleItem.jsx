import React from "react";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";

export default class IconToggleItem extends React.Component {
  static defaultProps = {
    className: "",
    icon: ""
  };

  render() {
    const { className, icon } = this.props;
    return <EditorIcon className={className} icon={icon} />;
  }
}
