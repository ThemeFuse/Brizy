import classnames from "classnames";
import React, { CSSProperties, ReactElement, ReactNode } from "react";
import { Popper } from "react-popper";
import { ReactReduxContext } from "react-redux";
import { ToolbarItemsInstance } from "visual/component/Toolbar/ToolbarItems";
import { getPosition as getToolbarPosition } from "visual/component/Toolbar/state";
import { deviceModeSelector } from "visual/redux/selectors";
import { WithClassName } from "visual/types/attributes";
import { clamp } from "visual/utils/math";
import { attachRef } from "visual/utils/react";

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
  size?: "small" | "medium" | "large" | "xlarge" | "auto";
  offset: number;
  toolbar?: ToolbarItemsInstance;
  inPortal: boolean;
  node?: HTMLElement;
  children: ReactNode;
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
    children: undefined,
    node: undefined
  };

  isRepositioning: boolean;
  contentRef: React.RefObject<HTMLDivElement>;
  popperUpdateFunctionRef = React.createRef<VoidFunction>();

  static contextType = ReactReduxContext;
  declare context: React.ContextType<typeof ReactReduxContext>;

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
  componentDidUpdate() {
    const updateFn = this.popperUpdateFunctionRef.current;

    if (typeof updateFn === "function") {
      requestAnimationFrame(updateFn);
    }

    // const { toolbar } = this.props;
    // if (toolbar && !this.isRepositioning) {
    //   this.repositionByToolbar(toolbar);
    // }
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

    const tooltipNode = this.contentRef.current;
    const doc = tooltipNode.ownerDocument;
    const viewportWidth = doc.documentElement.clientWidth;
    const viewportHeight = doc.documentElement.clientHeight;
    const pageScroll = doc.documentElement.scrollTop;
    // const pageHeight = document.documentElement.scrollHeight;
    const pageHasOverflowHidden =
      doc.documentElement.classList.contains("brz-ow-hidden");

    const toolbarPosition = getToolbarPosition();

    const toolbarRect = toolbarNode.getBoundingClientRect();

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
      const store = this.context?.store;

      if (!store) {
        return 0;
      }

      const deviceMode = deviceModeSelector(store.getState());
      const isDesktop = deviceMode === "desktop";
      const padding = isDesktop ? 31 : 0;
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
        {({ ref, style, arrowProps, placement, forceUpdate }): ReactElement => (
          <div
            ref={(r) => {
              attachRef(r, ref);
              attachRef(forceUpdate, this.popperUpdateFunctionRef);
            }}
            className={className}
            style={style}
          >
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
