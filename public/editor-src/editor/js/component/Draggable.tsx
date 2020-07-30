import React, { createRef, ReactNode, RefObject } from "react";
import $ from "jquery";

type Position = Record<"x" | "y", number>;
const getClientOffset = (event: MouseEvent): Position => ({
  x: event.clientX,
  y: event.clientY
});

export type Props<R extends HTMLElement> = {
  children: (ref: RefObject<R>, className?: string) => ReactNode;
  active?: boolean;
  onDragStart?: () => void;
  onDrag?: (delta: { deltaX: number; deltaY: number }) => void;
  onDragEnd?: () => void;
  exceptions?: string[];
  draggingCursor?: string;
};

export class Draggable<R extends HTMLElement> extends React.Component<
  Props<R>
> {
  static defaultProps = {
    active: true
  };

  elRef = createRef<R>();

  isMouseDown = false;

  startPosition?: Position;

  currentPosition?: Position;

  lastDelta?: Position;

  componentDidMount(): void {
    if (this.props.active) {
      this.init();
    }
  }

  componentDidUpdate(prevProps: Readonly<Props<R>>): void {
    if (this.props.active !== prevProps.active) {
      if (this.props.active) {
        this.init();
      } else {
        this.destroy();
      }
    }
  }

  componentWillUnmount(): void {
    this.clearDragData();
  }

  init(): void {
    this.elRef.current?.addEventListener("mousedown", this.handleMouseDown);
  }

  destroy(): void {
    this.elRef.current?.removeEventListener("mousedown", this.handleMouseDown);
    this.cleanMouseEvents();
  }

  handleMouseDown = (e: MouseEvent): void => {
    const exceptions = this.props.exceptions ?? [];
    if (
      exceptions.length &&
      e.target &&
      $(e.target).closest(exceptions.join(", ")).length
    ) {
      return;
    }

    e.stopPropagation();
    // left click only
    if (e.button !== 0) {
      return;
    }

    this.initMouseEvents();
  };

  startDrag = (client: Position): void => {
    const { draggingCursor, onDragStart } = this.props;

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    global.BRZ_IS_DRAGGING = true;

    this.isMouseDown = true;
    this.currentPosition = this.startPosition = client;

    onDragStart?.();
    this.initMouseEvents();

    requestAnimationFrame(this.update);

    const overlayNodes = document.querySelectorAll<HTMLDivElement>(
      ".brz-ed-draggable-overlay"
    );

    if (overlayNodes.length) {
      overlayNodes.forEach(overlayNode => {
        overlayNode.style.pointerEvents = "all";

        if (draggingCursor) {
          overlayNode.style.cursor = draggingCursor;
        }
      });
    }

    window.parent.document.body.classList.add("brz-pointer-events-none");
  };

  handleMouseMove = (e: MouseEvent): void => {
    if (!this.isMouseDown) {
      this.startDrag(getClientOffset(e));
    } else {
      this.currentPosition = getClientOffset(e);
    }
  };

  handleMouseUp = (): void => {
    this.clearDragData();

    if (!this.isMouseDown) {
      this.props.onDragEnd?.();
    }
  };

  clearDragData = (): void => {
    this.cleanMouseEvents();

    if (!this.isMouseDown) {
      return;
    }

    const { draggingCursor } = this.props;

    const overlayNodes = document.querySelectorAll<HTMLDivElement>(
      ".brz-ed-draggable-overlay"
    );

    if (overlayNodes.length) {
      overlayNodes.forEach(overlayNode => {
        overlayNode.style.pointerEvents = "none";

        if (draggingCursor) {
          overlayNode.style.cursor = "auto";
        }
      });
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    global.BRZ_IS_DRAGGING = false;

    this.isMouseDown = false;
    this.startPosition = undefined;
    this.lastDelta = undefined;

    window.parent.document.body.classList.remove("brz-pointer-events-none");
  };

  update = (): void => {
    if (this.isMouseDown && this.startPosition && this.currentPosition) {
      requestAnimationFrame(this.update);

      const deltaX = this.currentPosition.x - this.startPosition.x;
      const deltaY = this.currentPosition.y - this.startPosition.y;
      const { x: lastDeltaX, y: lastDeltaY } = this.lastDelta || { x: 0, y: 0 };

      if (deltaX !== lastDeltaX || deltaY !== lastDeltaY) {
        this.lastDelta = {
          x: deltaX,
          y: deltaY
        };

        this.props.onDrag?.({
          deltaX,
          deltaY
        });
      }
    }
  };

  initMouseEvents = (): void => {
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
  };

  cleanMouseEvents = (): void => {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
  };

  render(): ReactNode {
    const { children, active } = this.props;

    return children(this.elRef, active ? "brz-ed-dd-cancel" : undefined);
  }
}

export default Draggable;
