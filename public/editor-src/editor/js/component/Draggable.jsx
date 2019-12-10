import React from "react";
import classnames from "classnames";
import _ from "underscore";

const getClientOffset = event => ({
  x: event.clientX,
  y: event.clientY
});

class Draggable extends React.Component {
  static defaultProps = {
    className: "",
    style: {},
    draggingCursor: null,
    renderPopover: null,
    onDragStart: _.noop,
    onDrag: _.noop,
    onDragEnd: _.noop
  };

  state = {
    isDragging: false
  };

  isMouseDown = null;

  startPosition = null;

  currentPosition = null;

  lastDelta = null;

  componentWillUnmount() {
    this.cleanMouseEvents();
  }

  handleClick = e => {
    e.stopPropagation();
  };

  handleMouseDown = e => {
    // left click only
    if (e.button !== 0) {
      return;
    }

    const { draggingCursor, onDragStart } = this.props;

    const overlayNode = document.querySelector(".brz-root__container-after");
    overlayNode.style.pointerEvents = "all";
    if (draggingCursor) {
      overlayNode.style.cursor = draggingCursor;
    }

    global.BRZ_IS_DRAGGING = true;

    this.isMouseDown = true;
    this.currentPosition = this.startPosition = getClientOffset(e);

    window.parent.document.body.classList.add("brz-pointer-events-none");
    onDragStart();
    this.initMouseEvents();

    this.setState({ isDragging: true }, () => {
      requestAnimationFrame(this.update);
    });
  };

  handleMouseMove = e => {
    this.currentPosition = getClientOffset(e);
  };

  handleMouseUp = () => {
    const { draggingCursor, onDragEnd } = this.props;

    const overlayNode = document.querySelector(".brz-root__container-after");
    overlayNode.style.pointerEvents = "none";
    if (draggingCursor) {
      overlayNode.style.cursor = "auto";
    }

    global.BRZ_IS_DRAGGING = false;

    this.isMouseDown = false;
    this.startPosition = null;
    this.lastDelta = null;

    window.parent.document.body.classList.remove("brz-pointer-events-none");
    this.cleanMouseEvents();
    onDragEnd();

    this.setState({
      isDragging: false
    });
  };

  update = () => {
    if (this.isMouseDown) {
      requestAnimationFrame(this.update);

      const deltaX = this.currentPosition.x - this.startPosition.x;
      const deltaY = this.currentPosition.y - this.startPosition.y;
      const { x: lastDeltaX, y: lastDeltaY } = this.lastDelta || {};

      if (deltaX !== lastDeltaX || deltaY !== lastDeltaY) {
        this.lastDelta = {
          x: deltaX,
          y: deltaY
        };
        this.props.onDrag({
          deltaX,
          deltaY
        });
      }
    }
  };

  initMouseEvents = () => {
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
  };

  cleanMouseEvents = () => {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
  };

  render() {
    const { className: _className, style = null, renderPopover } = this.props;
    const { isDragging } = this.state;
    const className = classnames(
      "brz-ed-draggable",
      "brz-ed-dd-cancel",
      _className
    );

    return (
      <div
        className={className}
        style={style}
        onMouseDown={this.handleMouseDown}
        onClick={this.handleClick}
      >
        {this.props.children}
        {isDragging && renderPopover && renderPopover()}
      </div>
    );
  }
}

export default Draggable;
