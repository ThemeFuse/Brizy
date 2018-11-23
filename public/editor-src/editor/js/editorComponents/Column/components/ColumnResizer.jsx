import React, { Component } from "react";
import classnames from "classnames";
import Draggable from "visual/component/Draggable";

class ColumnResizer extends Component {
  handleDrag = ({ deltaX }) => {
    const { position, onResize } = this.props;

    onResize(deltaX, position);
  };

  handleDragEnd = () => {
    const { onResizeEnd } = this.props;

    onResizeEnd();
  };

  renderPopover = () => {
    const widths = this.props.popoverData();
    const content = widths.reduce((acc, width, index) => {
      if (index > 0) {
        acc.push(
          <span
            key={`${index}-divider`}
            className="brz-ed-draggable__column-popover__divider"
          >
            /
          </span>
        );
      }

      acc.push(
        <span
          key={`${index}-value`}
          className="brz-ed-draggable__column-popover__percent"
        >
          {width.toFixed(1)}%
        </span>
      );

      return acc;
    }, []);

    return <div className="brz-ed-draggable__column-popover">{content}</div>;
  };

  render() {
    const { position, color } = this.props;
    const className = classnames(
      "brz-ed-draggable__column",
      `brz-ed-draggable__column--${position}`,
      `brz-ed-draggable__column--${color}`
    );

    return (
      <Draggable
        className={className}
        renderPopover={this.renderPopover}
        onDrag={this.handleDrag}
        onDragEnd={this.handleDragEnd}
      >
        <div className="brz-ed-draggable__column--item" />
      </Draggable>
    );
  }
}

export default ColumnResizer;
