import React from "react";
import ReactDOM from "react-dom";
import _ from "underscore";
import jQuery from "jquery";
import { int, outerWidth, outerHeight } from "./utils";

export default class Draggable extends React.Component {
  static defaultProps = {
    bounds: "parent",
    onDragStart: _.noop,
    onDrag: _.noop,
    onDragEnd: _.noop,
    defaultPosition: {
      x: 50,
      y: 50
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      x: props.position ? props.position.x : props.defaultPosition.x,
      y: props.position ? props.position.y : props.defaultPosition.y
    };
    this.window = null;
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    const parent = node.parentNode || node.ownerDocument.body;

    jQuery(parent).on("click", this.onDragEnd);

    this.window = node.ownerDocument.defaultView;
  }

  componentWillUnmount() {
    const node = ReactDOM.findDOMNode(this);
    const parent = node.parentNode || node.ownerDocument.body;

    this.enableTextSelect();

    jQuery(parent).off("click", this.onDragEnd);
    jQuery(this.window).off("mousemove", this.onDrag);
    jQuery(this.window).off("mouseup", this.onDragEnd);

    this.window = null;
  }

  disableTextSelect = () => {
    jQuery("*[contenteditable]").attr("contenteditable", false);
    jQuery("body").addClass("unselectable");
  };

  enableTextSelect = () => {
    jQuery("*[contenteditable]").attr("contenteditable", true);
    jQuery("body").removeClass("unselectable");
  };

  getBoundPosition = () => {
    let propsBound = this.props.bounds;
    const node = ReactDOM.findDOMNode(this);

    if (typeof propsBound === "string") {
      const { ownerDocument } = node;

      let boundNode;
      if (propsBound === "parent") {
        boundNode = node.parentNode;
      } else {
        boundNode = ownerDocument.querySelector(propsBound);
        if (!boundNode)
          throw new Error(
            'Bounds selector "' + propsBound + '" could not find an element.'
          );
      }

      propsBound = {
        left: outerWidth(boundNode),
        top: outerHeight(boundNode)
      };
    }

    return propsBound;
  };

  getMouseCoordinates = evt => {
    const node = ReactDOM.findDOMNode(this);
    const offsetParent = node.offsetParent || node.ownerDocument.body;
    const isBody = offsetParent === offsetParent.ownerDocument.body;
    const offsetParentRect = isBody
      ? { left: 0, top: 0 }
      : offsetParent.getBoundingClientRect();

    const x = evt.clientX + offsetParent.scrollLeft - offsetParentRect.left;
    const y = evt.clientY + offsetParent.scrollTop - offsetParentRect.top;

    return { x, y };
  };

  getCoordinates = event => {
    const mouseCoordinates = this.getMouseCoordinates(event);
    const propsBound = this.getBoundPosition();

    return {
      x: int(Math.max(Math.min(mouseCoordinates.x, propsBound.left), 0)),
      y: int(Math.max(Math.min(mouseCoordinates.y, propsBound.top), 0))
    };
  };

  getCoordinatesInPercent = event => {
    const { x, y } = this.getCoordinates(event);
    const propsBound = this.getBoundPosition();

    return {
      x: int((x * 100) / propsBound.left),
      y: int((y * 100) / propsBound.top)
    };
  };

  onClick = event => {
    this.onDrag(event);
  };

  onDragStart = event => {
    event.preventDefault();
    const coordinatesInPercent = this.getCoordinatesInPercent(event);
    this.props.onDragStart(coordinatesInPercent);

    this.disableTextSelect();

    jQuery(this.window).on("mousemove", this.onDrag);
    jQuery(this.window).on("mouseup", this.onDragEnd);
  };

  onDrag = event => {
    const coordinatesInPercent = this.getCoordinatesInPercent(event);

    this.props.onDrag(coordinatesInPercent);
    this.setState(coordinatesInPercent);
  };

  onDragEnd = event => {
    const coordinatesInPercent = this.getCoordinatesInPercent(event);
    this.props.onDragEnd(coordinatesInPercent);

    this.enableTextSelect();

    jQuery(this.window).off("mousemove", this.onDrag);
    jQuery(this.window).off("mouseup", this.onDragEnd);

    this.setState(coordinatesInPercent);
  };

  render() {
    const s = this.state;

    const style = {
      left: `${s.x}%`,
      top: `${s.y}%`
    };
    return React.cloneElement(React.Children.only(this.props.children), {
      style: style,
      onMouseDown: this.onDragStart
    });
  }
}
