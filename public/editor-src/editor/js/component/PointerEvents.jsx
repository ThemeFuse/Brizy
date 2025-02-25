import { Component, createRef } from "react";

export default class PointerEvents extends Component {
  nodeRef = createRef();

  componentDidMount() {
    const node = this.nodeRef?.current;

    if (node) {
      node.addEventListener("mousedown", this.onMouseDown);
    }
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
    const { children } = this.props;

    return children({
      ref: this.nodeRef
    });
  }
}
