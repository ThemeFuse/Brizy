import React from "react";
import jQuery from "jquery";
import classnames from "classnames";
import _ from "underscore";

const getClientOffset = event => ({
  x: event.clientX,
  y: event.clientY
});

class Draggable extends React.Component {
  static defaultProps = {
    style: {},
    renderPopover: _.noop,
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
    global.BRZ_IS_DRAGGING = true;

    this.isMouseDown = true;
    this.currentPosition = this.startPosition = getClientOffset(e);

    this.props.onDragStart();
    this.initMouseEvents();
    this.handleResize();

    this.setState({ isDragging: true });
  };

  handleMouseMove = e => {
    this.currentPosition = getClientOffset(e);
  };

  handleMouseUp = e => {
    global.BRZ_IS_DRAGGING = false;

    this.isMouseDown = false;
    this.startPosition = null;
    this.lastDelta = null;

    this.setState(
      {
        isDragging: false
      },
      () => {
        this.cleanMouseEvents();
        this.props.onDragEnd();
      }
    );
  };

  handleResize = () => {
    if (this.isMouseDown) {
      requestAnimationFrame(this.handleResize);

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

  initMouseEvents() {
    jQuery("[contenteditable]").attr("contenteditable", false);
    jQuery("input, textarea").attr("readonly", true);
    jQuery("body").addClass("disable-select");

    jQuery(window).on("mousemove", this.handleMouseMove);
    jQuery(window).on("mouseup", this.handleMouseUp);
  }

  cleanMouseEvents() {
    jQuery("[contenteditable]").attr("contenteditable", true);
    jQuery("input, textarea").attr("readonly", false);
    jQuery("body").removeClass("disable-select");

    jQuery(window).off("mousemove", this.handleMouseMove);
    jQuery(window).off("mouseup", this.handleMouseUp);
  }

  render() {
    const { className: _className, style = null, renderPopover } = this.props;
    const { isDragging } = this.state;
    const className = classnames(
      "brz-ed-draggable",
      "brz-ed-dd-cancel",
      { "brz-ed-draggable--dragging": isDragging },
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
        {isDragging && renderPopover()}
      </div>
    );
  }
}

export default Draggable;
