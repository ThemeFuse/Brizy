import React from "react";
import classnames from "classnames";
import { Popper } from "react-popper";
import { getPosition as getToolbarPosition } from "visual/component/Toolbar/state";
import { clamp } from "visual/utils/math";

const TOOLBAR_MARGIN = 14;

// used to prevent situations where the toolbar has
// enough space to be opened above it's target node
// but the tooltip is too large and opens below,
// thus overlapping the target node and creating a bad UX
// when the node isn't seen when it's being edited
const TOOLBAR_HEIGHT_MAGIC = 300;

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
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const pageScroll = document.documentElement.scrollTop;
    // const pageHeight = document.documentElement.scrollHeight;
    const pageHasOverflowHidden = document.documentElement.classList.contains(
      "brz-ow-hidden"
    );

    const { toolbarRef, toolbarCSSPosition, toolbarItemIndex } = toolbar;
    const toolbarPosition = getToolbarPosition();

    const toolbarNode = toolbarRef.current;
    const toolbarRect = toolbarNode.getBoundingClientRect();

    const toolbarItemNode = toolbarNode.querySelector(
      `.brz-ed-toolbar__items > .brz-ed-toolbar__item:nth-child(${toolbarItemIndex})`
    );
    const toolbarItemRect = toolbarItemNode.getBoundingClientRect();

    const tooltipNode = this.contentRef.current;
    const tooltipRect = tooltipNode.getBoundingClientRect();

    // Toolbar

    const canAlignBelow =
      (pageHasOverflowHidden ? 0 : pageScroll) +
        toolbarRect.bottom +
        TOOLBAR_MARGIN +
        Math.max(tooltipRect.height, TOOLBAR_HEIGHT_MAGIC) <=
      (pageHasOverflowHidden
        ? viewportHeight
        : Math.max(viewportHeight, document.body.clientHeight));
    const canAlignAbove =
      (pageHasOverflowHidden ? 0 : pageScroll) +
        toolbarRect.top -
        TOOLBAR_MARGIN -
        tooltipRect.height >=
      0;
    const offsetTop = toolbarCSSPosition === "fixed" ? 0 : pageScroll;
    let placementStyle;

    const alignAbove = () => {
      const tooltipTop = "unset";
      const tooltipBottom = `calc(100% - ${offsetTop}px - ${toolbarRect.top}px + ${TOOLBAR_MARGIN}px)`;

      placementStyle = {
        position: toolbarCSSPosition,
        top: tooltipTop,
        bottom: tooltipBottom,
        left: getLeft()
      };
    };
    const alignBelow = () => {
      const tooltipTop =
        offsetTop + toolbarRect.top + toolbarRect.height + TOOLBAR_MARGIN;

      placementStyle = {
        position: toolbarCSSPosition,
        top: tooltipTop,
        left: getLeft()
      };
    };
    const getLeft = () => {
      const padding = 2;
      const minX = padding;
      const maxX = viewportWidth - tooltipRect.width - padding;
      const x =
        toolbarItemRect.left +
        toolbarItemRect.width / 2 -
        tooltipRect.width / 2;

      return clamp(x, minX, maxX);
    };

    let tooltipAlignment;
    if (toolbarPosition === "above") {
      if (canAlignAbove) {
        tooltipAlignment = "above";
        alignAbove();
      } else {
        tooltipAlignment = "below";
        alignBelow();
      }
    }

    if (toolbarPosition === "below") {
      if (canAlignBelow) {
        tooltipAlignment = "below";
        alignBelow();
      } else {
        tooltipAlignment = "above";
        alignAbove();
      }
    }

    // Arrow

    const arrowPlacement = tooltipAlignment === "above" ? "top" : "bottom";
    let arrowPlacementStyle = {
      left:
        toolbarItemRect.left + toolbarItemRect.width / 2 - placementStyle.left
    };

    this.isRepositioning = true;
    this.setState(
      {
        placementStyle,
        arrowPlacement,
        arrowPlacementStyle
      },
      () => (this.isRepositioning = false)
    );
  }

  renderInToolbar() {
    const { className: _className, isOpen, size, arrow, children } = this.props;
    const { placementStyle, arrowPlacement, arrowPlacementStyle } = this.state;

    const className = classnames(
      "brz-ed-animated brz-ed-animated--fadeInUp",
      "brz-ed-tooltip__overlay",
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
