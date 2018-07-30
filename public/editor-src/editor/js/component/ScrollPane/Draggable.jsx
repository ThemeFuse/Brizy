import React, { Component } from "react";
import ReactDOM from "react-dom";
import _ from "underscore";
import jQuery from "jquery";

export default class Draggable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startTop: false,
      startLeft: false
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }
  componentDidMount() {
    const elem = ReactDOM.findDOMNode(this);
    this.document = jQuery(
      elem.style
        ? // Element within the document
          elem.ownerDocument
        : // Element is window or document
          elem.document || elem
    );
    this.window = jQuery(
      this.document[0].defaultView || this.document[0].parentWindow
    );
  }
  handleMouseDown(before, after, event) {
    // FIXME ugly hack
    if (jQuery(event.target).hasClass("brz-ed-sidebar-block-remove")) {
      before(event);
      after(event);
      return;
    }
    before(event);
    this.window.on("mousemove", this.handleMouseMove);
    this.window.on("mouseup", this.handleMouseUp);
    this.setState({ startLeft: event.clientX, startTop: event.clientY });
    this.props.onDragStart(this);
    after(event);
  }
  handleMouseMove(event) {
    var offset = {
      top: event.clientY - this.state.startTop,
      left: event.clientX - this.state.startLeft
    };
    this.props.onDragMove(offset, this);
    event.preventDefault();
  }
  handleMouseUp() {
    this.window.off("mousemove", this.handleMouseMove);
    this.window.off("mouseup", this.handleMouseUp);
    this.props.onDragEnd(this);
  }
  render() {
    const child = React.Children.only(this.props.children);

    // As the child is a DIV.. you cannot pass these: onDragStart,onDragMove
    const { children, onDragStart, onDragMove } = this.props;

    return React.cloneElement(child, {
      onMouseDown: e => {
        this.handleMouseDown(
          child.props.onMouseDown || _.noop,
          this.props.onMouseDown || _.noop,
          e
        );
      }
    });
  }
}

Draggable.defaultProps = {
  currentWindow: {},
  onDragEnd: _.noop,
  onDragStart: _.noop,
  onDragMove: _.noop
};
