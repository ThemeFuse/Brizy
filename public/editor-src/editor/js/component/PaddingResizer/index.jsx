import React, { Component } from "react";
import { rolesHOC } from "visual/component/Roles";
import { getStore } from "visual/redux/store";
import Handle from "./Handle";

class PaddingResizer extends Component {
  startPosition = null;

  handleTopDrag = dragInfo => {
    this.handleDrag("paddingTop", dragInfo);
  };

  handleBottomDrag = dragInfo => {
    this.handleDrag("paddingBottom", dragInfo);
  };

  handleDrag = (type, { deltaY }) => {
    const v = this.props.value;
    const { deviceMode } = getStore().getState().ui;

    type = v.paddingType === "grouped" ? "padding" : type;

    if (deviceMode === "tablet") {
      type = v.tabletPaddingType === "grouped" ? "padding" : type;

      const capitalizedFirstLetter =
        type.charAt(0).toUpperCase() + type.slice(1);
      type = `tablet${capitalizedFirstLetter}`;
    }

    if (deviceMode === "mobile") {
      type = v.mobilePaddingType === "grouped" ? "padding" : type;

      const capitalizedFirstLetter =
        type.charAt(0).toUpperCase() + type.slice(1);
      type = `mobile${capitalizedFirstLetter}`;
    }

    this.startPosition = this.startPosition || v[type];
    const value = Math.max(15, this.startPosition + deltaY);

    let newValue = {};
    switch (type) {
      case "paddingTop":
        newValue = {
          paddingType: "ungrouped",
          paddingTop: value
        };
        break;
      case "paddingBottom":
        newValue = {
          paddingType: "ungrouped",
          paddingBottom: value
        };
        break;
      case "tabletPaddingTop":
        newValue = {
          tabletPaddingType: "ungrouped",
          tabletPaddingTop: value
        };
        break;
      case "tabletPaddingBottom":
        newValue = {
          tabletPaddingType: "ungrouped",
          tabletPaddingBottom: value
        };
        break;
      case "mobilePaddingTop":
        newValue = {
          mobilePaddingType: "ungrouped",
          mobilePaddingTop: value
        };
        break;
      case "mobilePaddingBottom":
        newValue = {
          mobilePaddingType: "ungrouped",
          mobilePaddingBottom: value
        };
        break;
      case "padding":
        newValue = {
          paddingType: "ungrouped",
          paddingTop: v[type],
          paddingBottom: v[type],
          [type]: value
        };
        break;
      case "tabletPadding":
        newValue = {
          tabletPaddingType: "ungrouped",
          tabletPaddingTop: v[type],
          tabletPaddingBottom: v[type],
          [type]: value
        };
        break;
      case "mobilePadding":
        newValue = {
          mobilePaddingType: "ungrouped",
          mobilePaddingTop: v[type],
          mobilePaddingBottom: v[type],
          [type]: value
        };
        break;
    }

    this.props.onChange(newValue);
  };

  handleDragEnd = () => {
    this.startPosition = null;
  };

  renderForEdit() {
    let {
      padding,
      tabletPadding,
      mobilePadding,
      paddingType,
      tabletPaddingType,
      mobilePaddingType,
      paddingTop,
      paddingBottom,
      tabletPaddingTop,
      tabletPaddingBottom,
      mobilePaddingTop,
      mobilePaddingBottom
    } = this.props.value;

    if (paddingType === "grouped") {
      paddingTop = paddingBottom = padding;
    }
    if (tabletPaddingType === "grouped") {
      tabletPaddingTop = tabletPaddingBottom = tabletPadding;
    }
    if (mobilePaddingType === "grouped") {
      mobilePaddingTop = mobilePaddingBottom = mobilePadding;
    }
    return (
      <React.Fragment>
        <Handle
          position="top"
          onDrag={this.handleTopDrag}
          onDragEnd={this.handleDragEnd}
          value={`${paddingTop}px`}
          tabletValue={`${tabletPaddingTop}px`}
          mobileValue={`${mobilePaddingTop}px`}
        />
        {this.props.children}
        <Handle
          position="bottom"
          onDrag={this.handleBottomDrag}
          onDragEnd={this.handleDragEnd}
          value={`${paddingBottom}px`}
          tabletValue={`${tabletPaddingBottom}px`}
          mobileValue={`${mobilePaddingBottom}px`}
        />
      </React.Fragment>
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
  component: PaddingResizer,
  fallbackRender: ({ value, children }) => {
    let {
      padding,
      paddingType,
      paddingTop,
      paddingBottom,
      tabletPadding,
      tabletPaddingType,
      tabletPaddingTop,
      tabletPaddingBottom,
      mobilePadding,
      mobilePaddingType,
      mobilePaddingTop,
      mobilePaddingBottom
    } = value;

    if (paddingType === "grouped") {
      paddingTop = paddingBottom = padding;
    }
    if (tabletPaddingType === "grouped") {
      tabletPaddingTop = tabletPaddingBottom = tabletPadding;
    }
    if (mobilePaddingType === "grouped") {
      mobilePaddingTop = mobilePaddingBottom = mobilePadding;
    }

    const topStyle = {
      visibility: "hidden",
      "--height": `${paddingTop}px`,
      "--tabletHeight": `${tabletPaddingTop}px`,
      "--mobileHeight": `${mobilePaddingTop}px`
    };
    const bottomStyle = {
      visibility: "hidden",
      "--height": `${paddingBottom}px`,
      "--tabletHeight": `${tabletPaddingBottom}px`,
      "--mobileHeight": `${mobilePaddingBottom}px`
    };

    return (
      <React.Fragment>
        <div className="brz-ed-draggable__padding" style={topStyle} />
        {children}
        <div className="brz-ed-draggable__padding" style={bottomStyle} />
      </React.Fragment>
    );
  }
});
