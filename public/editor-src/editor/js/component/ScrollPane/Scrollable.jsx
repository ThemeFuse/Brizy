import React, { Component } from "react";
import _ from "underscore";

export default class Scrollable extends Component {
  content = React.createRef();

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
    const scrollMax = Math.max(scroll, client);
    const overflow = scrollMax - client;
    const thumb = (client / scrollMax) * track;
    const piece = track - thumb;
    const shift = overflow === 0 ? 0 : (position / overflow) * piece;

    return {
      client,
      offset,
      position,
      track,
      overflow,
      thumb,
      piece,
      shift,
      scroll: scrollMax
    };
  }

  updateDOM = () => {
    // XXX Have no idea why does it work...
    setTimeout(() => {
      if (this.unmounted) {
        return;
      }

      const node = this.content.current;

      if (node) {
        this.props.onUpdateDOM(this.math, node);
      }
    }, 0);
  };

  render() {
    return (
      <div
        ref={this.content}
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
