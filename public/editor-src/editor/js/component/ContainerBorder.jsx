import React from "react";
import classnames from "classnames";
import ClickOutside from "visual/component/ClickOutside";

let instancesByPath = {};
export let currentContainerBorder = null;

class ContainerBorder extends React.Component {
  static defaultProps = {
    className: "",
    borderColor: "grey", // grey, blue
    clickOutsideExceptions: [],
    borderStyle: "solid", // dotted, dashed, solid
    activeBorderStyle: "solid", // dotted, dashed, solid
    outSide: true, // inside / outside border
    reactToHover: true,
    reactToClick: true,
    showBorders: true,
    path: ""
  };

  containerRef = React.createRef();

  border1Ref = React.createRef();

  border2Ref = React.createRef();

  constructor(props) {
    super(props);
    const { path, showBorders } = this.props;

    /**
     * the below three variables were used to be stored in local state.
     * but the problem with that was that we needed to update the state
     * VERY frequently and thus causing many rerenders that were stressing
     * the main thread.
     * we moved to a less idiomatic but way more performant solution that
     * involves changing the css classes directly with the DOM api
     */
    this.isActive = false;
    this.isHovered = false;
    this.showBorders = showBorders;

    if (path) {
      instancesByPath[path] = this;
    }
  }

  componentWillUnmount() {
    const { path } = this.props;

    delete instancesByPath[path];
    currentContainerBorder = null;
  }

  componentWillReceiveProps({ path: newPath }) {
    const oldPathStr = String(this.props.path);
    const newPathStr = String(newPath);

    if (oldPathStr !== newPathStr) {
      delete instancesByPath[oldPathStr];
      instancesByPath[newPathStr] = this;
    }
  }

  handleClickOutside = () => {
    if (this.isActive) {
      this.isActive = false;
      currentContainerBorder = null;
      this.setClasses();
    }
  };

  handleClick = e => {
    this.isActive = true;
    currentContainerBorder = this;
    this.setClasses();
  };

  handleMouseOver = e => {
    if (global.BRZ_IS_DRAGGING) {
      return;
    }

    if (!this.isHovered) {
      this.isHovered = true;
      this.setClasses();
    }
  };

  handleMouseOut = e => {
    if (global.BRZ_IS_DRAGGING) {
      return;
    }

    if (this.isHovered) {
      this.isHovered = false;
      this.setClasses();
    }
  };

  setActive = active => {
    if (this.isActive !== active) {
      this.isActive = active;
      this.setClasses();
    }
  };

  setHover = hovered => {
    if (this.isHovered !== hovered) {
      this.isHovered = hovered;
      this.setClasses();
    }
  };

  setShowBorder = showBorders => {
    if (this.showBorders !== showBorders) {
      this.showBorders = showBorders;
      this.setClasses();
    }
  };

  setParentsHover = hovered => {
    const pathStr = String(this.props.path);

    Object.keys(instancesByPath).forEach(instancePathStr => {
      if (pathStr.indexOf(instancePathStr) === 0) {
        instancesByPath[instancePathStr].setHover(hovered);
      }
    });
  };

  setClasses() {
    const { activeBorderStyle } = this.props;

    if (this.isHovered || this.isActive) {
      this.containerRef.current.classList.add("active");
    } else {
      this.containerRef.current.classList.remove("active");
    }

    if (
      (this.showBorders || this.isActive) &&
      (this.isActive || this.isHovered)
    ) {
      this.border1Ref.current.classList.add(
        "brz-ed-border--active",
        `brz-ed-border--active-${activeBorderStyle}`
      );
      this.border2Ref.current.classList.add(
        "brz-ed-border--active",
        `brz-ed-border--active-${activeBorderStyle}`
      );
    } else {
      this.border1Ref.current.classList.remove(
        "brz-ed-border--active",
        `brz-ed-border--active-${activeBorderStyle}`
      );
      this.border2Ref.current.classList.remove(
        "brz-ed-border--active",
        `brz-ed-border--active-${activeBorderStyle}`
      );
    }
  }

  render() {
    const {
      className: className_,
      borderColor,
      borderStyle,
      outSide,
      clickOutsideExceptions,
      reactToHover,
      reactToClick,
      children
    } = this.props;
    const className = classnames("brz-ed-border", className_);

    const border1ClassName = classnames("brz-ed-border__inner-1", {
      "brz-ed-border--no-space": !outSide,
      [`brz-ed-border--${borderColor}`]: borderColor,
      [`brz-ed-border--${borderStyle}`]: borderStyle
    });
    const border2ClassName = classnames("brz-ed-border__inner-2", {
      "brz-ed-border--no-space": !outSide,
      [`brz-ed-border--${borderColor}`]: borderColor,
      [`brz-ed-border--${borderStyle}`]: borderStyle
    });

    const content = (
      <div
        ref={this.containerRef}
        className={className}
        onMouseOver={reactToHover ? this.handleMouseOver : null}
        onMouseOut={reactToHover ? this.handleMouseOut : null}
        onClick={reactToClick ? this.handleClick : null}
      >
        <div ref={this.border1Ref} className={border1ClassName} />
        <div ref={this.border2Ref} className={border2ClassName} />
        {children}
      </div>
    );

    return reactToClick ? (
      <ClickOutside
        exceptions={clickOutsideExceptions}
        onClickOutside={this.handleClickOutside}
      >
        {content}
      </ClickOutside>
    ) : (
      content
    );
  }
}

export default ContainerBorder;
