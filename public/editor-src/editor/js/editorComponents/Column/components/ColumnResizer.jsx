import classnames from "classnames";
import React, { Component } from "react";
import { DraggableDiv } from "visual/component/DraggableDiv";

class ColumnResizer extends Component {
  state = {
    resize: false
  };

  handleDragStart = () => {
    const { position, onResizeStart } = this.props;

    onResizeStart(position);

    this.setState({ resize: true });
  };

  handleDrag = ({ deltaX }) => {
    const { position, onResize } = this.props;

    onResize(deltaX, position);
  };

  handleDragEnd = () => {
    const { position, onResizeEnd } = this.props;

    onResizeEnd(position);
    this.setState({ resize: false });
  };

  renderPopover = () => {
    const { isRTL, popoverData } = this.props;

    const widths = popoverData() ?? [];

    if (isRTL) widths.reverse();

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
      <DraggableDiv
        className={className}
        draggingCursor="col-resize"
        onDragStart={this.handleDragStart}
        onDrag={this.handleDrag}
        onDragEnd={this.handleDragEnd}
      >
        <div className="brz-ed-draggable__column--item" />
        {this.state.resize && this.renderPopover()}
      </DraggableDiv>
    );
  }
}
export default ColumnResizer;
