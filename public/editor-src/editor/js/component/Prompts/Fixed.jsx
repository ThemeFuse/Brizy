import React from "react";
import _ from "underscore";
import classnames from "classnames";
import HotKeys from "visual/component/HotKeys";

class Fixed extends React.Component {
  static defaultProps = {
    className: "",
    onClose: _.noop
  };

  render() {
    const { className: _className, children, onClose } = this.props;
    const className = classnames("brz-ed-fixed", _className);

    return (
      <div className={className}>
        <HotKeys
          keyNames={["esc"]}
          id="key-helper-prompt-esc"
          onKeyUp={this.props.onClose}
        />
        <div className="brz-ed-fixed-overlay" onClick={onClose} />
        <div className="brz-ed-fixed-scroll">{children}</div>
      </div>
    );
  }
}

export default Fixed;
