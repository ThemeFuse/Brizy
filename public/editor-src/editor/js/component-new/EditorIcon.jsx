import React from "react";
import _ from "underscore";
import classnames from "classnames";
import { editorIconUrl } from "visual/utils/icons";

export default class EditorIcon extends React.Component {
  static defaultProps = {
    className: "",
    icon: "nc-circle-add",
    onClick: _.noop
  };

  render() {
    const { className: _className, icon, onClick } = this.props;
    const className = classnames("brz-icon-svg", _className);

    return (
      <svg className={className} onClick={onClick}>
        <use xlinkHref={editorIconUrl(icon)} />
      </svg>
    );
  }
}
