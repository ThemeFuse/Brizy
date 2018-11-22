import React from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";

class RoundPlus extends React.Component {
  static defaultProps = {
    className: "",
    icon: null,
    onClick: _.noop
  };

  render() {
    const { className: _className, icon } = this.props;
    const className = classnames(_className, "floating-action-button");

    return (
      <div className={className} onClick={this.props.onClick}>
        {icon ? <EditorIcon icon={icon} /> : null}
      </div>
    );
  }
}

export default RoundPlus;
