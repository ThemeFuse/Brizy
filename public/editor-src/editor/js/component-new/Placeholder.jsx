import React from "react";
import classnames from "classnames";
import EditorIcon from "visual/component-new/EditorIcon";

export default class Placeholder extends React.Component {
  static defaultProps = {
    className: "",
    icon: "",
    containerWidth: ""
  };

  render() {
    const { className: _className, icon, containerWidth } = this.props;
    const className = classnames("brz-shortcode__placeholder", _className);
    const style = {
      fontSize: `${Math.round(16 + 0.05 * (containerWidth - 1))}px`
    };

    return (
      <div className={className} style={style}>
        <EditorIcon icon={icon} />
      </div>
    );
  }
}
