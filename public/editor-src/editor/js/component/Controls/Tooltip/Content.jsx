import React from "react";
import ReactDOM from "react-dom";
import classnames from "classnames";
import { Popper } from "react-popper";
import { getPosition } from "visual/component/Toolbar/PortalToolbar/state";

const SIDEBAR_WIDTH = 48;
const TOOLTIP_SPACE = 14;
const TOOLBAR_PADDING = 12;

export default class TooltipContent extends React.Component {
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

  /*
   * commented because reposition causes react perf problems (cascading updates)
   * and it seems unnecessary because when commented nothing seems changes visually.
   * Will leave here for a number of releases and potentially remove in the future
   */
  // componentDidUpdate() {
  //   if (this.isRepositioning) {
  //     return;
  //   }

  //   const { toolbar } = this.props;

  //   if (toolbar) {
  //     this.repositionByToolbar(toolbar);
  //   }
  // }

  repositionByToolbar(toolbar) {
    let { placement, arrowPlacementStyle } = this.props;
    const vertical = placement.split("-")[0];

    // eslint-disable-next-line react/no-find-dom-node
    const toolbarNode = ReactDOM.findDOMNode(toolbar);
    const {
      top: toolbarTop,
      right: toolbarRight,
      left: toolbarLeft,
      width: toolbarWidth,
      height: toolbarHeight
    } = toolbarNode.getBoundingClientRect();
    const {
      toolbarItemIndex,
      toolbarItemsLength,
      toolbarCSSPosition
    } = toolbar;

    const {
      width: contentWidth,
      height: contentHeight
    } = this.contentRef.current.getBoundingClientRect();

    const windowTop = toolbarCSSPosition === "fixed" ? 0 : window.scrollY;

    const toolbarItemWidth =
      (toolbarWidth - TOOLBAR_PADDING) / toolbarItemsLength;

    const toolbarItemWidthCenter =
      toolbarItemWidth * toolbarItemIndex -
      toolbarItemWidth / 2 +
      TOOLBAR_PADDING / 2;

    const toolbarItemCenter =
      Math.round((toolbarItemWidthCenter - contentWidth / 2) * 10) / 10;

    const contentTop = windowTop + toolbarTop - TOOLTIP_SPACE;
    const contentLeft = toolbarLeft + toolbarItemCenter;
    const contentMinLeft = SIDEBAR_WIDTH;
    const contentMaxLeft = document.documentElement.clientWidth - contentWidth;
    const viewBottom =
      document.documentElement.clientHeight - toolbarTop - contentHeight;

    let placementStyle = {
      top: "unset",
      bottom: `calc(100vh - ${contentTop}px)`,
      left: contentLeft,
      position: toolbarCSSPosition
    };

    // try to open in the same way (above, below) as the toolbar did
    if (
      getPosition() === "below" ||
      contentTop - contentHeight <= windowTop ||
      (vertical === "bottom" && viewBottom > contentHeight)
    ) {
      placementStyle.bottom = "";
      placementStyle.top =
        windowTop + toolbarTop + toolbarHeight + TOOLTIP_SPACE;
      placement = `bottom-${placement.split("-")[1]}`;
    } else if (vertical === "bottom" && viewBottom <= contentHeight) {
      placement = `top-${placement.split("-")[1]}`;
    }
    if (contentLeft >= contentMaxLeft) {
      const arrowPosition =
        toolbarItemWidth * (toolbarItemsLength - toolbarItemIndex + 1) -
        toolbarItemWidth / 2 +
        TOOLBAR_PADDING / 2;
      placement = `${placement.split("-")[0]}-right`;
      placementStyle.left = toolbarRight - contentWidth;
      arrowPlacementStyle = { left: contentWidth - arrowPosition };
    }
    if (contentLeft <= contentMinLeft) {
      placement = `${placement.split("-")[0]}-left`;
      placementStyle.left = toolbarLeft;
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
