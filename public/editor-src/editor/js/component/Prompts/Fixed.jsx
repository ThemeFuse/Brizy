import React from "react";
import _ from "underscore";
import classnames from "classnames";
import HotKeys from "visual/component/HotKeys";

class Fixed extends React.Component {
  static defaultProps = {
    onClose: _.noop,
    className: ""
  };

  render() {
    const className = classnames("brz-ed-fixed", this.props.className);

    return (
      <div className={className}>
        <HotKeys
          keyNames={["esc"]}
          id="key-helper-prompt-esc"
          onKeyUp={this.props.onClose}
        />
        <div className="brz-ed-fixed-overlay" onClick={this.props.onClose} />
        <div className="brz-ed-fixed-scroll">{this.props.children}</div>
      </div>
    );
  }
}

export default Fixed;
