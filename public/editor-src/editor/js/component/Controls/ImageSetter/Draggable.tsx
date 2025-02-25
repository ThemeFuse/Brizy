import { noop } from "es-toolkit";
import React, { ReactElement, createRef } from "react";
import {
  DraggableProps,
  MouseCoordinates
} from "visual/component/Controls/ImageSetter/types";
import { int, outerHeight, outerWidth } from "./utils";

export default class Draggable extends React.Component<
  DraggableProps,
  MouseCoordinates
> {
  static defaultProps = {
    bounds: "parent",
    onDragStart: noop,
    onDrag: noop,
    onDragEnd: noop,
    defaultPosition: {
      x: 50,
      y: 50
    }
  };

  window: Window | undefined = undefined;
  ref: React.RefObject<HTMLDivElement> = createRef();

  constructor(props: DraggableProps) {
    super(props);

    this.state = {
      x: props.position ? props.position.x : props.defaultPosition.x,
      y: props.position ? props.position.y : props.defaultPosition.y
    };
    this.window = undefined;
  }

  static getDerivedStateFromProps(
    nextProps: { position: { x: number; y: number } },
    state: { x: number; y: number }
  ) {
    const oldX = state.x;
    const oldY = state.y;
    const newX = nextProps.position.x;
    const newY = nextProps.position.y;

    if (oldX !== newX || oldY !== newY) {
      return {
        x: newX,
        y: newY
      };
    }
    return null;
  }

  componentDidMount() {
    const node = this.ref.current;
    const parent = node?.parentNode || node?.ownerDocument.body;

    if (parent) parent.addEventListener("click", this.onDragEnd);

    if (node?.ownerDocument.defaultView) {
      this.window = node?.ownerDocument.defaultView;
    }
  }

  componentWillUnmount() {
    const node = this.ref.current;
    const parent = node?.parentNode || node?.ownerDocument.body;

    this.enableTextSelect();

    if (parent) parent.removeEventListener("click", this.onDragEnd);

    if (this.window) {
      this.window.removeEventListener("mousemove", this.onDrag);
      this.window.removeEventListener("mouseup", this.onDragEnd);
    }

    this.window = undefined;
  }

  disableTextSelect = () => {
    document
      .querySelectorAll("*[contenteditable]")
      .forEach((item) => item.setAttribute("contenteditable", "false"));
    document.body.classList.add("unselectable");
  };

  enableTextSelect = () => {
    document.body.classList.remove("unselectable");
    document
      .querySelectorAll("*[contenteditable]")
      .forEach((item) => item.setAttribute("contenteditable", "true"));
  };

  getBoundPosition = () => {
    let propsBound: DraggableProps["bounds"] = this.props.bounds;
    const node = this.ref.current;

    if (typeof propsBound === "string" && node) {
      const { ownerDocument } = node;

      let boundNode;
      if (propsBound === "parent") {
        boundNode = node.parentNode as HTMLElement | null;
      } else {
        boundNode = ownerDocument?.querySelector<HTMLElement>(propsBound);
        if (!boundNode)
          throw new Error(
            `Bounds selector ${propsBound} could not find an element.`
          );
      }

      if (boundNode) {
        propsBound = {
          left: outerWidth(boundNode),
          top: outerHeight(boundNode)
        };
      }
    }

    return propsBound;
  };

  getMouseCoordinates = (evt: MouseEvent) => {
    const node = this.ref.current;
    const offsetParent = node?.offsetParent || node?.ownerDocument.body;

    const isBody = offsetParent === offsetParent?.ownerDocument.body;
    const offsetParentRect = isBody
      ? { left: 0, top: 0 }
      : offsetParent?.getBoundingClientRect();

    const { clientX, clientY } = evt;

    let x = 0;
    let y = 0;

    if (offsetParent && offsetParentRect) {
      x = clientX + offsetParent.scrollLeft - offsetParentRect.left;
      y = clientY + offsetParent.scrollTop - offsetParentRect.top;
    }

    return { x, y };
  };

  getCoordinates = (event: MouseEvent) => {
    const mouseCoordinates = this.getMouseCoordinates(event);
    const propsBound = this.getBoundPosition();

    let boundLeft = 0;
    let boundTop = 0;

    if (
      typeof propsBound === "object" &&
      "left" in propsBound &&
      "top" in propsBound
    ) {
      boundLeft = propsBound.left ?? 0;
      boundTop = propsBound.top ?? 0;
    }

    return {
      x: int(String(Math.max(Math.min(mouseCoordinates.x, boundLeft), 0))),
      y: int(String(Math.max(Math.min(mouseCoordinates.y, boundTop), 0)))
    };
  };

  getCoordinatesInPercent = (event: MouseEvent) => {
    const { x, y } = this.getCoordinates(event);
    const propsBound = this.getBoundPosition();

    let boundLeft = 0;
    let boundTop = 0;

    if (
      typeof propsBound === "object" &&
      "left" in propsBound &&
      "top" in propsBound
    ) {
      boundLeft = propsBound.left ?? 0;
      boundTop = propsBound.top ?? 0;
    }

    return {
      x: int(String((x * 100) / boundLeft)),
      y: int(String((y * 100) / boundTop))
    };
  };

  onDragStart = (event: MouseEvent) => {
    event.preventDefault();
    const coordinatesInPercent = this.getCoordinatesInPercent(event);
    this.props.onDragStart(coordinatesInPercent);

    this.disableTextSelect();

    if (this.window) {
      this.window.addEventListener("mousemove", this.onDrag);
      this.window.addEventListener("mouseup", this.onDragEnd);
    }
  };

  onDrag = (event: MouseEvent) => {
    const coordinatesInPercent = this.getCoordinatesInPercent(event);
    this.props.onDrag(coordinatesInPercent);
    this.setState(coordinatesInPercent);
  };

  onDragEnd = (event: Event) => {
    const coordinatesInPercent = this.getCoordinatesInPercent(
      event as MouseEvent
    );
    this.props.onDragEnd(coordinatesInPercent);

    this.enableTextSelect();

    if (this.window) {
      this.window.removeEventListener("mousemove", this.onDrag);
      this.window.removeEventListener("mouseup", this.onDragEnd);
    }

    this.setState(coordinatesInPercent);
  };

  render() {
    const s = this.state;
    const style = {
      left: `${s.x}%`,
      top: `${s.y}%`
    };
    return React.cloneElement(
      React.Children.only(this.props.children) as ReactElement,
      {
        style: style,
        onMouseDown: this.onDragStart,
        ref: this.ref
      }
    );
  }
}
