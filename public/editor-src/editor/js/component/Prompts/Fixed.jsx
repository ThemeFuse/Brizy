import React from "react";
import _ from "underscore";

class Fixed extends React.Component {
  static defaultProps = {
    onClose: _.noop
  };

  render() {
    return (
      <div className="brz-ed-fixed">
        <div className="brz-ed-fixed-overlay" onClick={this.props.onClose} />
        <div className="brz-ed-fixed-scroll">{this.props.children}</div>
      </div>
    );
  }
}

export default Fixed;
