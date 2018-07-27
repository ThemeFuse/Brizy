import React from "react";
import classnames from "classnames";
import { editorIconUrl } from "visual/utils/icons";

export default class EditorIcon extends React.Component {
  static defaultProps = {
    className: "",
    icon: "nc-circle-add"
  };

  render() {
    const { className: _className, icon } = this.props;
    const className = classnames("brz-icon-svg", _className);

    return (
      <svg className={className}>
        <use xlinkHref={editorIconUrl(icon)} />
      </svg>
    );
  }
}
