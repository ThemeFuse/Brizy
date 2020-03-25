import React, { Component } from "react";
import _ from "underscore";
import { getStore } from "visual/redux/store";
import ClickOutside from "visual/component/ClickOutside";
import Draggable from "visual/component/Draggable";
import { rolesHOC } from "visual/component/Roles";
import { hideToolbar, showLastHiddenToolbar } from "visual/component/Toolbar";
import { capitalize } from "visual/utils/string";
import { clamp } from "visual/utils/math";

const normalizeKeyForCurrentDeviceMode = key => {
  const { deviceMode } = getStore().getState().ui;
  return deviceMode !== "desktop" ? `${deviceMode}${capitalize(key)}` : key;
};

const arrayToObject = points =>
  points.reduce((result, item) => {
    result[item] = true;
    return result;
  }, {});

const RESTRICTIONS = {
  height: {
    min: 3,
    max: Infinity
  },
  size: {
    min: 3,
    max: 100
  },
  width: {
    min: 3,
    max: 100
  },

  // Tablet
  tabletHeight: {
    min: 3,
    max: Infinity
  },
  tabletSize: {
    min: 3,
    max: 100
  },
  tabletWidth: {
    min: 3,
    max: 100
  },

  // Mobile
  mobileHeight: {
    min: 3,
    max: Infinity
  },
  mobileSize: {
    min: 3,
    max: 100
  },
  mobileWidth: {
    min: 3,
    max: 100
  }
};

class BoxResizer extends Component {
  static defaultProps = {
    points: [
      "topCenter",
      "topRight",
      "centerRight",
      "bottomLeft",
      "bottomCenter",
      "bottomRight",
      "centerLeft",
      "topLeft"
    ],
    restrictions: {},
    meta: {},
    onChange: _.noop
  };

  state = {
    showPoints: false
  };

  contentRef = React.createRef();

  startValue = null;

  startRect = null;

  cachedPoints = arrayToObject(this.props.points);

  componentWillReceiveProps(nextProps) {
    if (this.props.points !== nextProps.points) {
      this.cachedPoints = arrayToObject(nextProps.points);
    }
  }

  handleClick = () => {
    this.setState({ showPoints: true });
  };

  handleClickOutside = () => {
    if (this.state.showPoints) {
      this.setState({ showPoints: false });
    }
  };

  handleDragStart = () => {
    this.startValue = this.props.value;

    const node = this.contentRef.current;
    if (node) {
      this.startRect = node.getBoundingClientRect();
    }

    hideToolbar();
  };

  handleDragEnd = () => {
    this.startValue = null;
    this.startRect = null;

    showLastHiddenToolbar();
  };

  handleDrag(point, { deltaX, deltaY }) {
    let patchData;

    const normalizedAlignKey = normalizeKeyForCurrentDeviceMode(
      "horizontalAlign"
    );
    const align = this.props.meta[normalizedAlignKey];
    const deltaMultiplier = align === "center" ? 2 : 1;

    switch (point) {
      case "topCenter":
        patchData = [["height", -deltaY]];
        break;
      case "bottomCenter":
        patchData = [["height", deltaY]];
        break;
      case "centerLeft": {
        patchData = [["width", -deltaX * deltaMultiplier]];
        break;
      }
      case "centerRight": {
        patchData = [["width", deltaX * deltaMultiplier]];
        break;
      }
      case "topLeft": {
        const valueHasSize = Boolean(this.props.value.size);
        const dx = -deltaX * deltaMultiplier;
        const dy = -deltaY;

        patchData = valueHasSize
          ? [["size", { dx, dy }]]
          : [["width", dx], ["height", dy]];
        break;
      }
      case "topRight": {
        const valueHasSize = Boolean(this.props.value.size);
        const dx = deltaX * deltaMultiplier;
        const dy = -deltaY;

        patchData = valueHasSize
          ? [["size", { dx, dy }]]
          : [["width", dx], ["height", dy]];
        break;
      }
      case "bottomLeft": {
        const valueHasSize = Boolean(this.props.value.size);
        const dx = -deltaX * deltaMultiplier;
        const dy = deltaY;

        patchData = valueHasSize
          ? [["size", { dx, dy }]]
          : [["width", dx], ["height", dy]];
        break;
      }
      case "bottomRight": {
        const valueHasSize = Boolean(this.props.value.size);
        const dx = deltaX * deltaMultiplier;
        const dy = deltaY;

        patchData = valueHasSize
          ? [["size", { dx, dy }]]
          : [["width", dx], ["height", dy]];
        break;
      }
    }

    const patch = patchData.reduce((acc, [key, delta]) => {
      const normalizedKey = normalizeKeyForCurrentDeviceMode(key);
      const startValue = this.startValue[normalizedKey] || this.startValue[key];
      let startRectValue = this.startRect[key];

      let deltaInPercent;
      if (key === "size") {
        const { dx, dy } = delta;
        const ratioX = dx / this.startRect.width;
        const ratioY = dy / this.startRect.height;

        deltaInPercent =
          ratioX < ratioY
            ? (dx / this.startRect.width) * this.startValue[normalizedKey]
            : (dy / this.startRect.height) * this.startValue[normalizedKey];
      } else {
        deltaInPercent = (delta * startValue) / startRectValue;
      }

      const restrictions =
        this.props.restrictions[normalizedKey] || RESTRICTIONS[normalizedKey];

      acc[normalizedKey] = clamp(
        Math.round(startValue + deltaInPercent),
        restrictions.min,
        restrictions.max
      );

      return acc;
    }, {});

    this.props.onChange(patch);
  }

  handleTopCenterDrag = dragInfo => this.handleDrag("topCenter", dragInfo);

  handleBottomCenterDrag = dragInfo =>
    this.handleDrag("bottomCenter", dragInfo);

  handleCenterLeftDrag = dragInfo => this.handleDrag("centerLeft", dragInfo);

  handleCenterRightDrag = dragInfo => this.handleDrag("centerRight", dragInfo);

  handleTopLeftDrag = dragInfo => this.handleDrag("topLeft", dragInfo);

  handleTopRightDrag = dragInfo => this.handleDrag("topRight", dragInfo);

  handleBottomLeftDrag = dragInfo => this.handleDrag("bottomLeft", dragInfo);

  handleBottomRightDrag = dragInfo => this.handleDrag("bottomRight", dragInfo);

  renderForEdit() {
    const { showPoints } = this.state;
    const { children } = this.props;
    const {
      topCenter,
      topRight,
      centerRight,
      bottomLeft,
      bottomCenter,
      bottomRight,
      centerLeft,
      topLeft
    } = this.cachedPoints;

    return (
      <ClickOutside onClickOutside={this.handleClickOutside}>
        <div
          ref={this.contentRef}
          className="brz-ed-box__resizer"
          onClick={this.handleClick}
        >
          {children}
          {showPoints && topCenter && (
            <Draggable
              key="topCenter"
              className="brz-ed-box__resizer--point brz-ed-box__resizer--top-center"
              draggingCursor="ns-resize"
              onDragStart={this.handleDragStart}
              onDrag={this.handleTopCenterDrag}
              onDragEnd={this.handleDragEnd}
            />
          )}
          {showPoints && topRight && (
            <Draggable
              key="topRight"
              className="brz-ed-box__resizer--point brz-ed-box__resizer--top-right"
              draggingCursor="nesw-resize"
              onDragStart={this.handleDragStart}
              onDrag={this.handleTopRightDrag}
              onDragEnd={this.handleDragEnd}
            />
          )}
          {showPoints && centerRight && (
            <Draggable
              key="centerRight"
              className="brz-ed-box__resizer--point brz-ed-box__resizer--center-right"
              draggingCursor="col-resize"
              onDragStart={this.handleDragStart}
              onDrag={this.handleCenterRightDrag}
              onDragEnd={this.handleDragEnd}
            />
          )}
          {showPoints && bottomLeft && (
            <Draggable
              key="bottomLeft"
              className="brz-ed-box__resizer--point brz-ed-box__resizer--bottom-left"
              draggingCursor="nesw-resize"
              onDragStart={this.handleDragStart}
              onDrag={this.handleBottomLeftDrag}
              onDragEnd={this.handleDragEnd}
            />
          )}
          {showPoints && bottomCenter && (
            <Draggable
              key="bottomCenter"
              className="brz-ed-box__resizer--point brz-ed-box__resizer--bottom-center"
              draggingCursor="ns-resize"
              onDragStart={this.handleDragStart}
              onDrag={this.handleBottomCenterDrag}
              onDragEnd={this.handleDragEnd}
            />
          )}
          {showPoints && bottomRight && (
            <Draggable
              key="bottomRight"
              className="brz-ed-box__resizer--point brz-ed-box__resizer--bottom-right"
              draggingCursor="nwse-resize"
              onDragStart={this.handleDragStart}
              onDrag={this.handleBottomRightDrag}
              onDragEnd={this.handleDragEnd}
            />
          )}
          {showPoints && centerLeft && (
            <Draggable
              key="centerLeft"
              className="brz-ed-box__resizer--point brz-ed-box__resizer--center-left"
              draggingCursor="col-resize"
              onDragStart={this.handleDragStart}
              onDrag={this.handleCenterLeftDrag}
              onDragEnd={this.handleDragEnd}
            />
          )}
          {showPoints && topLeft && (
            <Draggable
              key="topLeft"
              className="brz-ed-box__resizer--point brz-ed-box__resizer--top-left"
              draggingCursor="nwse-resize"
              onDragStart={this.handleDragStart}
              onDrag={this.handleTopLeftDrag}
              onDragEnd={this.handleDragEnd}
            />
          )}
        </div>
      </ClickOutside>
    );
  }

  renderForView() {
    return this.props.children;
  }

  render() {
    return IS_EDITOR ? this.renderForEdit() : this.renderForView();
  }
}

export default rolesHOC({
  allow: ["admin"],
  component: BoxResizer,
  fallbackRender: ({ children }) => children
});
