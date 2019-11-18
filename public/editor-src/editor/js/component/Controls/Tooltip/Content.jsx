import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Popper } from "react-popper";

const SIDEBAR_WIDTH = 48;
const TOOLTIP_SPACE = 14;
const TOOLBAR_PADDING = 12;

export default class TooltipContent extends React.Component {
  static contextTypes = {
    position: PropTypes.string
  };

  static defaultProps = {
    className: "",
    isOpen: false,
    placement: "top-center",
    placementStyle: {},
    arrow: true,
    arrowPlacement: "top-center",
    arrowPlacementStyle: {},
    size: "",
    offset: 15,
    toolbar: null,
    inPortal: false,
    node: null
  };

  constructor(props) {
    super(props);

    const { placement, arrowPlacement } = props;
    this.state = {
      placement,
      arrowPlacement
    };
    this.isRepositioning = false;
    this.contentRef = React.createRef();
  }

  componentDidMount() {
    const { isOpen, toolbar } = this.props;

    if (isOpen && toolbar) {
      this.repositionByToolbar(toolbar);
    }
  }

  componentDidUpdate() {
    if (this.isRepositioning) {
      return;
    }

    const { toolbar } = this.props;

    if (toolbar) {
      this.repositionByToolbar(toolbar);
    }
  }

  repositionByToolbar(toolbar) {
    const toolbarTarget = ReactDOM.findDOMNode(toolbar);
    const {
      width: contentWidth,
      height: contentHeight
    } = this.contentRef.current.getBoundingClientRect();
    const {
      top: targetTop,
      right: targetRight,
      left: targetLeft,
      height: targetHeight,
      width: targetWidth
    } = toolbarTarget.getBoundingClientRect();

    let { placement, arrowPlacementStyle } = this.props;
    const { position } = this.context;
    const windowTop = position === "fixed" ? 0 : window.scrollY;
    const { toolbarItemIndex, toolbarItemsLength } = toolbar;

    const toolbarItemWidth =
      (targetWidth - TOOLBAR_PADDING) / toolbarItemsLength;

    const toolbarItemWidthCenter =
      toolbarItemWidth * toolbarItemIndex -
      toolbarItemWidth / 2 +
      TOOLBAR_PADDING / 2;

    const toolbarItemCenter =
      Math.round((toolbarItemWidthCenter - contentWidth / 2) * 10) / 10;

    const contentTop = windowTop + targetTop - TOOLTIP_SPACE - contentHeight;
    const contentLeft = targetLeft + toolbarItemCenter;
    const contentMinLeft = SIDEBAR_WIDTH;
    const contentMaxLeft = document.documentElement.clientWidth - contentWidth;

    let placementStyle = { top: contentTop, left: contentLeft, position };

    if (contentTop <= windowTop) {
      placementStyle.top = windowTop + targetTop + targetHeight + TOOLTIP_SPACE;
      placement = `bottom-${placement.split("-")[1]}`;
    }
    if (contentLeft >= contentMaxLeft) {
      const arrowPosition =
        toolbarItemWidth * (toolbarItemsLength - toolbarItemIndex + 1) -
        toolbarItemWidth / 2 +
        TOOLBAR_PADDING / 2;
      placement = `${placement.split("-")[0]}-right`;
      placementStyle.left = targetRight - contentWidth;
      arrowPlacementStyle = { left: contentWidth - arrowPosition };
    }
    if (contentLeft <= contentMinLeft) {
      placement = `${placement.split("-")[0]}-left`;
      placementStyle.left = targetLeft;
      arrowPlacementStyle = { left: toolbarItemWidthCenter };
    }

    this.isRepositioning = true;
    this.setState(
      {
        placement,
        placementStyle,
        arrowPlacement: placement,
        arrowPlacementStyle
      },
      () => (this.isRepositioning = false)
    );
  }

  renderInToolbar() {
    const { className: _className, isOpen, size, arrow, children } = this.props;
    const {
      placement,
      placementStyle,
      arrowPlacement,
      arrowPlacementStyle
    } = this.state;
    const className = classnames(
      "brz-ed-animated brz-ed-animated--fadeInUp",
      `brz-ed-tooltip__overlay brz-ed-tooltip--${placement}`,
      { [`brz-ed-tooltip--${size}`]: size },
      { "brz-invisible": !isOpen },
      _className
    );
    const arrowClassName = classnames(
      "brz-ed-arrow",
      `brz-ed-arrow--${arrowPlacement}`
    );

    return (
      <div ref={this.contentRef} className={className} style={placementStyle}>
        {arrow && (
          <div className={arrowClassName} style={arrowPlacementStyle} />
        )}
        {children}
      </div>
    );
  }

  renderSimple() {
    const {
      className: _className,
      size,
      arrow,
      node,
      placement,
      offset,
      children
    } = this.props;
    const className = classnames(
      "brz-ed-animated brz-ed-animated--fadeInUp",
      "brz-ed-tooltip__overlay",
      { [`brz-ed-tooltip--${size}`]: size },
      _className
    );

    return (
      <Popper
        referenceElement={node}
        placement={placement}
        eventsEnabled={false}
        modifiers={{
          offset: { offset: `0, ${offset}px` },
          computeStyle: { gpuAcceleration: false }
        }}
      >
        {({ ref, style, arrowProps, placement }) => (
          <div ref={ref} className={className} style={style}>
            {arrow && (
              <div
                className={`brz-ed-arrow brz-ed-arrow--${placement}`}
                ref={arrowProps.ref}
                style={{ ...arrowProps.style, margin: "0" }}
              />
            )}
            {children}
          </div>
        )}
      </Popper>
    );
  }

  render() {
    return this.props.toolbar ? this.renderInToolbar() : this.renderSimple();
  }
}
