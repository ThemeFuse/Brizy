import React, { Component } from "react";
import _ from "underscore";
import classnames from "classnames";
import MouseEventsDelayed from "./MouseEventsDelayed";
import Draggable from "visual/component-new/Draggable";

export default class PaddingResizerHandle extends Component {
  static defaultProps = {
    position: "",
    value: "",
    mobileValue: "",
    onDrag: _.noop,
    onDragEnd: _.noop
  };

  isDragging = false;

  isInElement = false;

  hideAfterDrag = false;

  state = { active: false };

  handleMouseEnter = () => {
    this.cursorInsideElement = true;
  };

  handleMouseLeave = () => {
    this.cursorInsideElement = false;
  };

  handleMouseEnterSuccess = () => {
    if (!global.BRZ_IS_DRAGGING) {
      this.setState({
        active: true
      });
    }
  };

  handleMouseLeaveSuccess = () => {
    if (!this.isDragging) {
      this.setState({
        active: false
      });
    }
  };

  handleDrag = dragInfo => {
    if (!this.state.active) {
      return;
    }

    this.isDragging = true;
    this.props.onDrag(dragInfo);
  };

  handleDragEnd = () => {
    if (!this.state.active) {
      return;
    }

    this.isDragging = false;

    if (!this.cursorInsideElement) {
      this.setState({
        active: false
      });
    }

    this.props.onDragEnd();
  };

  render() {
    const { position, value, mobileValue } = this.props;
    const className = classnames("brz-ed-draggable__padding", {
      "brz-ed-draggable__padding--top": position === "top",
      "brz-ed-draggable__padding--bottom": position === "bottom",
      "brz-ed-draggable-active": this.state.active
    });
    const style = {
      "--height": value,
      "--mobileHeight": mobileValue
    };

    return (
      <MouseEventsDelayed
        delay={100}
        onEnter={this.handleMouseEnter}
        onEnterSuccess={this.handleMouseEnterSuccess}
        onLeave={this.handleMouseLeave}
        onLeaveSuccess={this.handleMouseLeaveSuccess}
      >
        <Draggable
          className={className}
          style={style}
          onDrag={this.handleDrag}
          onDragEnd={this.handleDragEnd}
        >
          <span className="brz-ed-draggable__padding--value brz-ed-draggable__padding--desktop-value">
            {value}
          </span>
          <span className="brz-ed-draggable__padding--value brz-ed-draggable__padding--mobile-value">
            {mobileValue}
          </span>
        </Draggable>
      </MouseEventsDelayed>
    );
  }
}
