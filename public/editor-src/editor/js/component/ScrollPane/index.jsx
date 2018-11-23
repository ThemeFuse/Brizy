import React, { Component } from "react";
import ReactDOM from "react-dom";
import Scrollable from "./Scrollable";
import Draggable from "./Draggable";

export default class ScrollPane extends Component {
  static defaultProps = {
    className: "brz-ed-scroll-pane", // default style
    style: {},
    window: null,
    onlyWide: false,
    wrapScrollable: item => item,
    onChange: () => {}
  };

  constructor(props) {
    super(props);
    this._start = 0;
    this._wide = {};
    this._tall = {};
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  captureStart = event => {
    this._start = false;
  };

  handleChange = ({ left = null, top = null }) => {
    const elem = ReactDOM.findDOMNode(this.scrollable);

    this.props.onChange({
      left: left || elem.scrollLeft,
      top: top || elem.scrollTop
    });
  };

  handleMouseDown = event => {
    const track = ReactDOM.findDOMNode(this.wideTrack);
    const rect = track.getBoundingClientRect();
    const mouse = event.clientX - rect.left;
    const shift = mouse - this._wide.thumb / 2;
    const position = (shift / this._wide.piece) * this._wide.overflow;
    if (event.target === track) {
      ReactDOM.findDOMNode(this.scrollable).scrollLeft = position;
    }
  };

  handleMouseDown2 = event => {
    const track = ReactDOM.findDOMNode(this.tallTrack);
    const rect = track.getBoundingClientRect();
    const mouse = event.clientY - rect.top;
    const shift = mouse - this._tall.thumb / 2;
    const position = (shift / this._tall.piece) * this._tall.overflow;
    if (event.target === track) {
      ReactDOM.findDOMNode(this.scrollable).scrollTop = position;
      this.handleChange({
        top: position
      });
    }
  };

  handleMove = offset => {
    if (this._start === false) {
      this._start = parseInt(this.wideThumb.style.left);
    }
    const shift = offset.left + this._start;
    const position = (shift / this._wide.piece) * this._wide.overflow;
    ReactDOM.findDOMNode(this.scrollable).scrollLeft = position;
    this.handleChange({
      left: position
    });
  };

  handleMove2 = offset => {
    if (this._start === false) {
      this._start = parseInt(this.tallThumb.style.top);
    }
    const shift = offset.top + this._start;
    const position = (shift / this._tall.piece) * this._tall.overflow;
    ReactDOM.findDOMNode(this.scrollable).scrollTop = position;
    this.handleChange({
      top: Math.min(this._tall.overflow, Math.max(0, position))
    });
  };

  handleResize = () => {
    this.forceUpdate();
  };

  handleSetPositionWide(n) {
    this.handleMove({ top: 0, left: n });
  }

  handleUpdateDOM = (math, c) => {
    let wideTrack = ReactDOM.findDOMNode(this.wideTrack),
      wideTrackHeight,
      wideThumb = this.wideThumb,
      tallTrack = ReactDOM.findDOMNode(this.tallTrack),
      tallTrackWidth,
      tallThumb = this.tallThumb,
      wide = {
        overflow: Math.max(0, c.scrollWidth - c.clientWidth)
      },
      tall = {
        overflow: Math.max(c.scrollHeight - c.clientHeight)
      };

    wideTrack.style.position = "absolute";
    tallTrack.style.position = "absolute";
    wideThumb.style.position = "relative";
    tallThumb.style.position = "relative";

    wideTrack.style.display = "block";
    wideTrackHeight = wideTrack.offsetHeight;
    tallTrack.style.display = "block";
    tallTrackWidth = tallTrack.offsetWidth;

    c.style.overflow = "hidden";
    c.style.borderBottomWidth = wideTrackHeight + "px";
    c.style.borderBottomStyle = wide.overflow ? "solid" : "none";
    c.style.borderRightWidth = tallTrackWidth + "px";
    c.style.borderRightStyle = tall.overflow ? "solid" : "none";

    // Previous step may lead to changing clientWidth/clientHeight
    wide.overflow = Math.max(0, c.scrollWidth - c.clientWidth);
    tall.overflow = Math.max(0, c.scrollHeight - c.clientHeight);

    wideTrack.style.display = wide.overflow ? "block" : "none";
    wideTrack.style.width = c.clientWidth + "px";
    wideTrack.style.left = 0;
    wideTrack.style.top = c.offsetHeight - wideTrackHeight + "px";

    tallTrack.style.display = tall.overflow ? "block" : "none";
    tallTrack.style.height = c.clientHeight + "px";
    tallTrack.style.top = 0;
    // Previous step may lead to changing  track sizes
    this._wide = wide = math(
      c.clientWidth,
      c.offsetWidth,
      c.scrollWidth,
      c.scrollLeft,
      wideTrack.clientWidth
    );
    this._tall = tall = math(
      c.clientHeight,
      c.offsetHeight,
      c.scrollHeight,
      c.scrollTop,
      tallTrack.clientHeight
    );
    wideThumb.style.left = wide.shift + "px";
    wideThumb.style.width = wide.thumb + "px";
    tallThumb.style.top = tall.shift + "px";
    tallThumb.style.height = tall.thumb + "px";
  };

  handleWheel = event => {
    event.stopPropagation();
    let a = ReactDOM.findDOMNode(this.scrollable);
    const top = a.scrollTop;
    const left = a.scrollLeft;
    const ua = navigator.userAgent.toLowerCase();

    let wheel_speed = 1;
    const isFirefox = /firefox/.test(ua);
    const isChrome = /chrome/.test(ua);

    if (isFirefox) wheel_speed = 20;
    if (isChrome) wheel_speed = 0.8;

    // is only Wide
    if (this.props.onlyWide) {
      a.scrollLeft =
        left + (event.deltaX ? event.deltaX : event.deltaY * wheel_speed);
    } else {
      event.preventDefault(); // prevent scrolling the default body's scrollbar
      a.scrollTop = top + event.deltaY * wheel_speed;
      a.scrollLeft = left + event.deltaX;
    }
    if (a.scrollTop != top || a.scrollLeft != left || this.props.onlyWide) {
      // scroll happenedtall.shift
      event.preventDefault();
    }

    this.handleChange({
      left: a.scrollLeft,
      top: a.scrollTop
    });
  };

  render() {
    return (
      <div
        className={this.props.className}
        style={{
          position: "relative",
          width: this.props.style.width,
          height: this.props.style.height
        }}
        onWheel={this.handleWheel}
      >
        <Scrollable
          ref={el => {
            this.scrollable = el;
          }}
          className="brz-ed-scroll-inner"
          style={this.props.style}
          onUpdateDOM={this.handleUpdateDOM}
        >
          {this.props.children}
        </Scrollable>
        <Draggable
          ref={el => {
            this.wideTrack = el;
          }}
          onDragStart={this.captureStart}
          onDragMove={this.handleMove}
        >
          <div className="brz-ed-wide-track" onMouseDown={this.handleMouseDown}>
            <div
              ref={el => {
                this.wideThumb = el;
              }}
              className="brz-ed-wide-thumb"
            />
          </div>
        </Draggable>
        <Draggable
          ref={el => {
            this.tallTrack = el;
          }}
          onDragStart={this.captureStart}
          onDragMove={this.handleMove2}
        >
          <div
            className="brz-ed-tall-track"
            onMouseDown={this.handleMouseDown2}
          >
            <div
              ref={el => {
                this.tallThumb = el;
              }}
              className="brz-ed-tall-thumb"
            />
          </div>
        </Draggable>
      </div>
    );
  }
}
