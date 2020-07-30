import React from "react";
import { ToolbarItems, ToolbarItemsProps } from "../ToolbarItems";
import { clamp } from "visual/utils/math";
import { setPosition } from "../state";

const SIDEBAR_WIDTH = 58;

// used to prevent situations where the toolbar has
// enough space to be opened above it's target node
// but the tooltip is too large and opens below,
// thus overlapping the target node and creating a bad UX
// when the node isn't seen when it's being edited
const TOOLBAR_HEIGHT_MAGIC = 300;

export type PortalToolbarPositionerProps = {
  node?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  offsetTop?: number;
  offsetBottom?: number;
  offsetLeft?: number;
  repositionOnUpdates?: boolean;
} & Omit<
  ToolbarItemsProps,
  "containerRef" | "arrowRef" | "arrow" | "onContentChange"
>;

export class PortalToolbarPositioner extends React.Component<
  PortalToolbarPositionerProps
> {
  static defaultProps = {
    offsetTop: 14,
    offsetBottom: 14,
    offsetLeft: 0
  };

  toolbarItemsContainerRef: React.RefObject<HTMLDivElement> = React.createRef();

  toolbarItemsArrowRef: React.RefObject<HTMLDivElement> = React.createRef();

  componentDidMount(): void {
    this.reposition();
  }

  componentDidUpdate(): void {
    if (this.props.repositionOnUpdates) {
      this.reposition();
    }
  }

  reposition = (): void => {
    const { node, offsetTop, offsetBottom, offsetLeft, position } = this.props;
    const toolbar = this.toolbarItemsContainerRef.current;
    const arrow = this.toolbarItemsArrowRef.current;
    const window = node.ownerDocument.defaultView;
    const viewportWidth = document.documentElement.clientWidth;

    // If there are no items do not reposition
    if (!toolbar) {
      return;
    }

    const toolbarRect = toolbar.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();

    // toolbar top + below
    let toolbarBelow;
    let toolbarTop;
    const windowTop = position === "fixed" ? 0 : window.scrollY;
    const fitsAbove =
      windowTop + nodeRect.top - (toolbarRect.height + TOOLBAR_HEIGHT_MAGIC) >=
      window.scrollY;

    if (fitsAbove) {
      toolbarBelow = false;
      toolbarTop =
        windowTop + nodeRect.top - toolbarRect.height - Number(offsetTop);

      setPosition("above");
    } else {
      toolbarBelow = true;
      toolbarTop =
        windowTop + nodeRect.top + nodeRect.height + Number(offsetBottom);

      setPosition("below");
    }

    // toolbar left
    const toolbarLeft =
      nodeRect.left +
      nodeRect.width / 2 -
      toolbarRect.width / 2 +
      Number(offsetLeft);
    const toolbarOutsideIframe =
      node.ownerDocument.defaultView === window.parent;
    const toolbarMinLeft = toolbarOutsideIframe ? SIDEBAR_WIDTH : 0;
    const toolbarMaxLeft = viewportWidth - toolbarRect.width;
    const toolbarClampedLeft = clamp(
      toolbarLeft,
      toolbarMinLeft,
      toolbarMaxLeft
    );

    // arrow left
    const arrowLeftShift = toolbarLeft - toolbarClampedLeft;

    // toolbar css
    toolbar.style.top = `${toolbarTop}px`;
    toolbar.style.left = `${toolbarClampedLeft}px`;
    if (position === "fixed") {
      toolbar.style.position = "fixed";
    }
    toolbar.classList.add("brz-ed-animated", "brz-ed-animated--fadeInDown");
    if (toolbarBelow) {
      toolbar.classList.add("brz-ed-toolbar--bottom");
    } else {
      toolbar.classList.remove("brz-ed-toolbar--bottom");
    }

    // arrow css
    if (arrow) {
      // this hides the arrow when it would have been positioned so close
      // to the edge of the toolbar, that a visual gap between it and the toolbar
      // would have been see because of the toolbar's border radius
      // 23 is a magic number that was determined through experimentation
      if (toolbarRect.width / 2 - Math.abs(arrowLeftShift) < 23) {
        arrow.classList.add("brz-hidden");
      } else {
        arrow.classList.remove("brz-hidden");
      }

      if (toolbarBelow) {
        arrow.classList.remove("brz-ed-arrow--top-center");
        arrow.classList.add("brz-ed-arrow--bottom-center");
      } else {
        arrow.classList.remove("brz-ed-arrow--bottom-center");
        arrow.classList.add("brz-ed-arrow--top-center");
      }
      arrow.style.left = `calc(50% + ${arrowLeftShift}px)`;
    }
  };

  render(): React.ReactElement {
    return (
      <ToolbarItems
        {...this.props}
        containerRef={this.toolbarItemsContainerRef}
        arrowRef={this.toolbarItemsArrowRef}
        arrow={true}
        onContentChange={this.reposition}
      />
    );
  }
}
