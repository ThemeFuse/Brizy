import React, { Component } from "react";
import ReactDOM from "react-dom";
import _ from "underscore";

export default class Scrollable extends Component {
  constructor(props) {
    super(props);

    this.updateDOM = this.updateDOM.bind(this);
  }

  componentDidMount() {
    this.updateDOM();
  }

  componentDidUpdate() {
    this.updateDOM();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  math(client, offset, scroll, position, track) {
    // In Google Chrome, sometimes scrollSize is less than clientSize by 1
    scroll = Math.max(scroll, client);
    var overflow = scroll - client,
      thumb = client / scroll * track,
      piece = track - thumb,
      shift = overflow == 0 ? 0 : position / overflow * piece;
    return {
      client: client,
      offset: offset,
      scroll: scroll,
      overflow: overflow,
      position: position,
      track: track,
      thumb: thumb,
      piece: piece,
      shift: shift
    };
  }

  updateDOM() {
    // XXX Have no idea why does it work...
    setTimeout(() => {
      if (this.unmounted) {
        return;
      }

      this.props.onUpdateDOM(this.math, ReactDOM.findDOMNode(this));
    }, 0);
  }

  render() {
    return (
      <div
        className={this.props.className}
        style={this.props.style}
        onScroll={this.updateDOM}
      >
        {this.props.children}
      </div>
    );
  }
}

Scrollable.defaultProps = {
  onUpdateDOM: _.noop
};
