import React from "react";
import classnames from "classnames";

class Overlay extends React.Component {
  render() {
    const className = classnames(
      "brz-ed-large-popup",
      this.props.show ? "brz-ed-large-popup-open" : "brz-ed-large-popup-closed"
    );

    return (
      <div className={className}>
        <div
          className="brz-ed-large-popup-btn-close"
          onClick={this.props.onClose}
        />
        {this.props.children}
      </div>
    );
  }
}

export default Overlay;
