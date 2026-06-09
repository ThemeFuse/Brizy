import classnames from "classnames";
import React from "react";
import { ThemeIcon } from "visual/component/ThemeIcon";

interface Props {
  icon: string;
  className?: string;
  style?: React.CSSProperties;
  type?: "editor" | "preview";
}

export default class Placeholder extends React.Component<Props> {
  render() {
    const {
      className: _className = "",
      icon = "",
      style = {},
      type = "editor"
    } = this.props;
    const className = classnames("brz-shortcode__placeholder", _className);

    return (
      <div className={className} style={style}>
        <ThemeIcon name={icon} type={type} />
      </div>
    );
  }
}
