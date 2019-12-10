import React from "react";
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
