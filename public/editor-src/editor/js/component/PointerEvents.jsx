import React, { Component } from "react";
import ReactDOM from "react-dom";

export default class PointerEvents extends Component {
  componentDidMount() {
    // eslint-disable-next-line react/no-find-dom-node
    ReactDOM.findDOMNode(this).addEventListener("mousedown", this.onMouseDown);
  }

  onMouseDown = () => {
    window.parent.document.addEventListener("mouseup", this.onMouseUp);
    window.parent.document.querySelector("#brz-ed-iframe").style.pointerEvents =
      "none";
  };

  onMouseUp = () => {
    window.parent.document.removeEventListener("mouseup", this.onMouseUp);
    window.parent.document
      .querySelector("#brz-ed-iframe")
      .style.removeProperty("pointer-events");
  };

  render() {
    return React.Children.only(this.props.children);
  }
}
