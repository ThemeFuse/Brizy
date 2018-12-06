import React from "react";
import classnames from "classnames";
import ThemeIcon from "visual/component/ThemeIcon";

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
        <ThemeIcon name={icon} type="editor" />
      </div>
    );
  }
}
