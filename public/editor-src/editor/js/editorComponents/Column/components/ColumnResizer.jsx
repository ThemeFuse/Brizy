import React, { Component } from "react";
import classnames from "classnames";
import Draggable from "visual/component-new/Draggable";

class ColumnResizer extends Component {
  renderPopover = () => {
    const [leftValue, rightValue] = this.props.popoverData();

    return (
      <div className="brz-ed-draggable__column-popover">
        <span className="brz-ed-draggable__column-popover__percent">
          {leftValue}%
        </span>
        <span className="brz-ed-draggable__column-popover__divider">/</span>
        <span className="brz-ed-draggable__column-popover__percent">
          {rightValue}%
        </span>
      </div>
    );
  };

  render() {
    const { children, position, color, onResize, onResizeEnd } = this.props;
    const className = classnames(
      "brz-ed-draggable__column",
      `brz-ed-draggable__column--${position}`,
      `brz-ed-draggable__column--${color}`
    );

    return (
      <Draggable
        className={className}
        renderPopover={this.renderPopover}
        onDrag={onResize}
        onDragEnd={onResizeEnd}
      >
        <div className="brz-ed-draggable__column--item" />
      </Draggable>
    );
  }
}

export default ColumnResizer;
