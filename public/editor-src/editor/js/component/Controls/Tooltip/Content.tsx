import React, { CSSProperties, ReactElement } from "react";
import classnames from "classnames";
import { Popper } from "react-popper";
import { getPosition as getToolbarPosition } from "visual/component/Toolbar/state";
import { clamp } from "visual/utils/math";
import { WithClassName } from "visual/utils/options/attributes";
import { ToolbarItemsInstance } from "visual/component/Toolbar/ToolbarItems";

const TOOLBAR_MARGIN = 14;

// used to prevent situations where the toolbar has
// enough space to be opened above it's target node
// but the tooltip is too large and opens below,
// thus overlapping the target node and creating a bad UX
// when the node isn't seen when it's being edited
const TOOLBAR_HEIGHT_MAGIC = 300;

interface Prs extends WithClassName {
  isOpen: boolean;
  placement:
    | "auto"
    | "auto-start"
    | "auto-end"
    | "top"
    | "top-start"
    | "top-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "right"
    | "right-start"
    | "right-end"
    | "left"
    | "left-start"
    | "left-end";
  placementStyle: CSSProperties;
  arrow: boolean;
  arrowPlacement: "top" | "bottom";
  arrowPlacementStyle: CSSProperties;
  size?: "small" | "medium" | "big" | "large" | "auto";
  offset: number;
  toolbar?: ToolbarItemsInstance;
  inPortal: boolean;
  node?: HTMLElement;
}

export type Props = Partial<Prs>;

export type State = Pick<
  Prs,
  "placement" | "placementStyle" | "arrowPlacement" | "arrowPlacementStyle"
>;

export class TooltipContent extends React.Component<Props, State> {
  static defaultProps: Prs = {
    className: "",
    isOpen: false,
    placement: "top",
    placementStyle: {},
    arrow: true,
    arrowPlacement: "top",
    arrowPlacementStyle: {},
    size: undefined,
    offset: 15,
    toolbar: undefined,
    inPortal: false,
    node: undefined
  };

  isRepositioning: boolean;
  contentRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);

    const { placement, arrowPlacement } = props;
    this.state = {
      placement: placement ?? TooltipContent.defaultProps.placement,
      placementStyle: TooltipContent.defaultProps.placementStyle,
      arrowPlacement:
        arrowPlacement ?? TooltipContent.defaultProps.arrowPlacement,
      arrowPlacementStyle: TooltipContent.defaultProps.arrowPlacementStyle
    };
    this.isRepositioning = false;
    this.contentRef = React.createRef();
  }

  componentDidMount(): void {
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
    // const pageHeight = document.documentElement.scrollHeight;
    const pageHasOverflowHidden = document.documentElement.classList.contains(
      "brz-ow-hidden"
    );

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
      const padding = 2;
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
    const arrowPlacementStyle = {
      left:
        toolbarItemRect.left +
        toolbarItemRect.width / 2 -
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

  renderSimple(): ReactElement {
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

  render(): ReactElement {
    return this.props.toolbar ? this.renderInToolbar() : this.renderSimple();
  }
}

export default TooltipContent;
