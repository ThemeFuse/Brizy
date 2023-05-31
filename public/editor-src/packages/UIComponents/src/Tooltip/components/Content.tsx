import classnames from "classnames";
import React, { CSSProperties, ReactElement } from "react";
import { Popper } from "react-popper";
import { clamp } from "../../utils/math";
import { TOOLBAR_HEIGHT_MAGIC, TOOLBAR_MARGIN } from "../constants";
import { ToolbarItemsInstance } from "../types";
import { ContentProps, ContentState } from "../types";
import { getPosition as getToolbarPosition } from "../utils";

export class TooltipContent extends React.Component<
  ContentProps,
  ContentState
> {
  isRepositioning = false;
  contentRef: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props: ContentProps) {
    super(props);

    const { placement } = props;
    this.state = {
      placement: placement,
      placementStyle: {},
      arrowPlacement: "top",
      arrowPlacementStyle: {}
    };
  }

  componentDidMount(): void {
    const { isOpen, toolbar } = this.props;

    if (isOpen && toolbar) {
      this.repositionByToolbar(toolbar);
    }
  }

  repositionByToolbar(toolbar: ToolbarItemsInstance): void {
    const { toolbarRef, toolbarCSSPosition, toolbarItemIndex } = toolbar;
    const toolbarNode = toolbarRef.current;
    const toolbarItemNode = toolbarNode?.querySelector(
      `.brz-ed-toolbar__items > .brz-ed-toolbar__item:nth-child(${toolbarItemIndex})`
    );
    const toolbarItemRect = toolbarItemNode?.getBoundingClientRect();

    if (
      !toolbarRef.current ||
      !this.contentRef.current ||
      !toolbarItemRect ||
      !toolbarNode
    ) {
      return;
    }
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const pageScroll = document.documentElement.scrollTop;
    const pageHasOverflowHidden =
      document.documentElement.classList.contains("brz-ow-hidden");

    const toolbarPosition = getToolbarPosition();

    const toolbarRect = toolbarNode.getBoundingClientRect();

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
    let placementStyle: CSSProperties = {};

    const getLeft = (): number => {
      const padding = 31;
      const minX = padding;
      const maxX = viewportWidth - tooltipRect.width - padding;
      const x =
        toolbarItemRect.left +
        toolbarItemRect.width / 2 -
        tooltipRect.width / 2;

      return clamp(x, minX, maxX);
    };

    const alignAbove = (): void => {
      const tooltipTop = "unset";
      const tooltipBottom = `calc(100% - ${offsetTop}px - ${toolbarRect.top}px + ${TOOLBAR_MARGIN}px)`;

      placementStyle = {
        position: toolbarCSSPosition,
        top: tooltipTop,
        bottom: tooltipBottom,
        left: getLeft()
      };
    };
    const alignBelow = (): void => {
      const tooltipTop =
        offsetTop + toolbarRect.top + toolbarRect.height + TOOLBAR_MARGIN;

      placementStyle = {
        position: toolbarCSSPosition,
        top: tooltipTop,
        left: getLeft()
      };
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
    const arrowPosition =
      getLeft() === 31 ? toolbarItemRect.width - 21 : toolbarItemRect.width / 2;

    const arrowPlacementStyle = {
      left:
        toolbarItemRect.left +
        arrowPosition -
        (Number(placementStyle.left) || 0)
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

  renderInToolbar(): ReactElement {
    const {
      className: _className,
      isOpen,
      size,
      showArrow: arrow,
      children
    } = this.props;
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

  renderSimple(): ReactElement {
    const {
      className: _className,
      size,
      showArrow,
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
        modifiers={[
          {
            name: "offset",
            options: { offset: [0, offset] }
          },
          {
            name: "computeStyles",
            options: { gpuAcceleration: false }
          }
        ]}
      >
        {({ ref, style, arrowProps, placement }): ReactElement => (
          <div ref={ref} className={className} style={style}>
            {showArrow && (
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

  render(): ReactElement {
    return this.props.toolbar ? this.renderInToolbar() : this.renderSimple();
  }
}
