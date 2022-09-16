import React from "react";
import classnames from "classnames";
import { ThemeIcon } from "visual/component/ThemeIcon";

export default class Placeholder extends React.Component {
  static defaultProps = {
    className: "",
    icon: "",
    style: {},
    type: "editor"
  };

  render() {
    const { className: _className, icon, style, type } = this.props;
    const className = classnames("brz-shortcode__placeholder", _className);

    return (
      <div className={className} style={style}>
        <ThemeIcon name={icon} type={type} />
      </div>
    );
  }
}
