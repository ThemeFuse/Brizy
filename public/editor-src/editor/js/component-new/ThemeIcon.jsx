import React from "react";
import classnames from "classnames";
import { templateIconUrl } from "visual/utils/icons";

export default class ThemeIcon extends React.Component {
  static defaultProps = {
    className: "",
    name: "",
    type: "",
    suffix: "nc_icon"
  };

  render() {
    const { className, name, type, suffix } = this.props;
    const classNames = classnames("brz-icon-svg", className);
    const pathToIcon = templateIconUrl(type, name, suffix);

    return (
      <svg className={classNames}>
        <use xlinkHref={pathToIcon} />
      </svg>
    );
  }
}
