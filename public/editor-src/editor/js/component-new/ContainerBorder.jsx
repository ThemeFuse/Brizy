import React from "react";
import classnames from "classnames";
import ClickOutside from "visual/component-new/ClickOutside";

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

  constructor(props) {
    super(props);
    const { path, showBorders } = this.props;

    this.state = {
      active: false,
      hovered: false,
      showBorders
    };

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
    if (this.state.active) {
      this.setState({ active: false });
      currentContainerBorder = null;
    }
  };

  handleClick = e => {
    this.setState({ active: true });
    currentContainerBorder = this;
  };

  handleOver = e => {
    if (global.BRZ_IS_DRAGGING) {
      return;
    }

    if (!this.state.hovered) {
      this.setState({ hovered: true });
    }
  };

  handleOut = e => {
    if (global.BRZ_IS_DRAGGING) {
      return;
    }

    if (this.state.hovered) {
      this.setState({ hovered: false });
    }
  };

  setActive = active => {
    if (this.state.active !== active) {
      this.setState({ active });
    }
  };

  setHover = hovered => {
    if (this.state.hovered !== hovered) {
      this.setState({ hovered });
    }
  };

  setShowBorder = showBorders => {
    if (this.state.showBorders !== showBorders) {
      this.setState({ showBorders });
    }
  };

  setParentsHover = hovered => {
    const pathStr = String(this.props.path);

    Object.keys(instancesByPath).forEach(instancePathStr => {
      if (pathStr.indexOf(instancePathStr) === 0) {
        instancesByPath[instancePathStr].setState({ hovered });
      }
    });
  };

  render() {
    const { active, hovered, showBorders } = this.state;
    const {
      className: _className,
      borderColor,
      borderStyle,
      activeBorderStyle,
      outSide,
      clickOutsideExceptions,
      reactToHover,
      reactToClick,
      children
    } = this.props;
    const className = classnames("brz-ed-border", _className, {
      active: hovered || active
    });
    let borders;

    if (showBorders || active) {
      const toolsBorder1 = classnames(
        "brz-ed-border__inner-1",
        { "brz-ed-border--no-space": !outSide },
        { [`brz-ed-border--${borderColor}`]: borderColor },
        { [`brz-ed-border--${borderStyle}`]: borderStyle },
        { "brz-ed-border--active": active || hovered },
        { [`brz-ed-border--active-${activeBorderStyle}`]: active || hovered }
      );
      const toolsBorder2 = classnames(
        "brz-ed-border__inner-2",
        { "brz-ed-border--no-space": !outSide },
        { [`brz-ed-border--${borderColor}`]: borderColor },
        { [`brz-ed-border--${borderStyle}`]: borderStyle },
        { "brz-ed-border--active": active || hovered },
        { [`brz-ed-border--active-${activeBorderStyle}`]: active || hovered }
      );

      borders = [
        <div key="border1" className={toolsBorder1} />,
        <div key="border2" className={toolsBorder2} />
      ];
    }

    const content = (
      <div
        className={className}
        onMouseOver={reactToHover ? this.handleOver : null}
        onMouseOut={reactToHover ? this.handleOut : null}
        onClick={reactToClick ? this.handleClick : null}
      >
        {borders}
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
