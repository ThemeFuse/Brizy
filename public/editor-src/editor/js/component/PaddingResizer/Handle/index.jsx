import classNames from "classnames";
import { noop } from "es-toolkit";
import React, { Component } from "react";
import Draggable from "visual/component/Draggable";
import { rolesHOC } from "visual/component/Roles";
import { isInsideRect } from "visual/component/Sortable/plugin/utils";
import { attachRef } from "visual/utils/react";
import MouseEventsDelayed from "./MouseEventsDelayed";

let instances = 0;
let docX;
let docY;

class PaddingResizerHandle extends Component {
  static defaultProps = {
    position: "",
    value: "",
    tabletValue: "",
    mobileValue: "",
    onDrag: noop,
    onDragEnd: noop
  };

  isDragging = false;

  state = { active: false };

  containerRef = React.createRef();

  componentDidMount() {
    instances++;

    if (instances === 1) {
      this.containerRef?.current.ownerDocument.addEventListener(
        "mousemove",
        this.handleDocMove
      );
    }
  }

  componentWillUnmount() {
    instances--;

    if (instances === 0) {
      this.containerRef?.current.ownerDocument.removeEventListener(
        "mousemove",
        this.handleDocMove
      );
    }
  }

  handleDocMove(e) {
    docX = e.clientX;
    docY = e.clientY;
  }

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

  handleDragStart = () => {
    const { onStart } = this.props;

    this.isDragging = true;
    if (typeof onStart === "function") {
      onStart();
    }

    if (!this.state.active) {
      this.setState({
        active: true
      });
    }
  };

  handleDrag = (dragInfo) => {
    if (!this.state.active) {
      return;
    }

    this.props.onDrag(dragInfo);
  };

  handleDragEnd = () => {
    const { onEnd } = this.props;

    if (typeof onEnd === "function") {
      onEnd();
    }

    if (!this.state.active) {
      return;
    }

    const node = this.containerRef.current;

    this.isDragging = false;

    this.setState(
      {
        active: isInsideRect(docX, docY, node?.getBoundingClientRect())
      },
      () => {
        // this is a hacky way that tries to catch cases
        // when mouseleave isn't triggered (the cursor is moved too fast)
        setTimeout(() => {
          if (
            node &&
            this.state.active &&
            !isInsideRect(docX, docY, node?.getBoundingClientRect())
          ) {
            this.setState({
              active: false
            });
          }
        }, 200);
      }
    );

    this.props.onDragEnd();
  };

  render() {
    const { position, value, tabletValue, mobileValue } = this.props;
    const className = classNames("brz-ed-draggable__padding", {
      "brz-ed-draggable__padding--top": position === "top",
      "brz-ed-draggable__padding--bottom": position === "bottom",
      "brz-ed-draggable__padding--active": this.state.active
    });

    return (
      <MouseEventsDelayed
        delay={500}
        onEnterSuccess={this.handleMouseEnterSuccess}
        onLeave={this.handleMouseLeaveSuccess}
        containerRef={this.containerRef}
      >
        <Draggable
          draggingCursor="ns-resize"
          onDragStart={this.handleDragStart}
          onDrag={this.handleDrag}
          onDragEnd={this.handleDragEnd}
        >
          {(refRoot, dragClass) => {
            return (
              <div
                ref={(el) => {
                  attachRef(el, this.containerRef);
                  attachRef(el, refRoot);
                }}
                className={classNames("brz-ed-draggable", dragClass, className)}
              >
                <span className="brz-ed-draggable__padding--value brz-ed-draggable__padding--desktop-value">
                  {value}
                </span>
                <span className="brz-ed-draggable__padding--value brz-ed-draggable__padding--tablet-value">
                  {tabletValue}
                </span>
                <span className="brz-ed-draggable__padding--value brz-ed-draggable__padding--mobile-value">
                  {mobileValue}
                </span>
              </div>
            );
          }}
        </Draggable>
      </MouseEventsDelayed>
    );
  }
}

export default rolesHOC({
  allow: ["admin"],
  component: PaddingResizerHandle,
  fallbackRender: ({ position }) => {
    const className = classNames({
      "brz-ed-draggable__padding--top": position === "top",
      "brz-ed-draggable__padding--bottom": position === "bottom"
    });

    return <div className={className} />;
  }
});
