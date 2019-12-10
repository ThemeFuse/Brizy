import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import ToolbarItems from "../ToolbarItems";
import { clamp } from "visual/utils/math";

const SIDEBAR_WIDTH = 58;

class Toolbar extends React.Component {
  static contextTypes = {
    position: PropTypes.string
  };

  static defaultProps = {
    arrow: true,
    items: [],
    offsetTop: 0,
    offsetBottom: 0,
    offsetLeft: 0,

    node: null,
    inside: false
  };

  componentDidMount() {
    this.reposition();
  }

  reposition = () => {
    // eslint-disable-next-line react/no-find-dom-node
    const bar = ReactDOM.findDOMNode(this);
    const {
      window,
      node,
      inside,
      offsetTop,
      offsetBottom,
      offsetLeft
    } = this.props;

    // If there are no items do not reposition
    if (!bar) {
      return;
    }

    const { position: contextPosition } = this.context;
    const corner = bar.querySelector(".brz-ed-toolbar__arrow");

    const barRect = bar.getBoundingClientRect();
    const targetRect = node.getBoundingClientRect();
    const windowTop = contextPosition === "fixed" ? 0 : window.scrollY;

    // bar top + below
    let barBelow = false;
    let barTop;
    if (inside) {
      barTop = windowTop + targetRect.top + Number(offsetTop);
    } else {
      const fitsAbove =
        windowTop + targetRect.top - barRect.height >= window.scrollY;

      if (fitsAbove) {
        barTop =
          windowTop + targetRect.top - barRect.height - Number(offsetTop);
      } else {
        barBelow = true;
        barTop =
          windowTop + targetRect.top + targetRect.height + Number(offsetBottom);
      }
    }

    // bar left
    const barLeft =
      targetRect.left +
      targetRect.width / 2 -
      barRect.width / 2 -
      Number(offsetLeft);
    const barOutsideIframe =
      bar.ownerDocument.body.querySelector("#brz-ed-iframe") !== null;
    const barMinLeft = barOutsideIframe ? SIDEBAR_WIDTH : 0;
    const barMaxLeft = document.documentElement.clientWidth - barRect.width;
    const barClampedLeft = clamp(barLeft, barMinLeft, barMaxLeft);

    // corner
    const cornerLeftShift = barLeft - barClampedLeft;

    // create a variable if in the future
    // reposition() will call setState
    const position = {
      barTop: barTop,
      barLeft: barClampedLeft,
      barBelow: barBelow,
      cornerLeftShift: cornerLeftShift
    };

    // update the DOM manual until
    // we will figure out a way to do this with setState
    bar.style.top = `${position.barTop}px`;
    bar.style.left = `${position.barLeft}px`;
    bar.classList.add("brz-ed-animated", "brz-ed-animated--fadeInDown");

    if (contextPosition === "fixed") {
      bar.style.position = "fixed";
    }
    if (position.barBelow) {
      bar.classList.add("brz-ed-toolbar--bottom");
      corner.classList.remove("brz-ed-arrow--top-center");
      corner.classList.add("brz-ed-arrow--bottom-center");
    } else {
      bar.classList.remove("brz-ed-toolbar--bottom");
      corner.classList.remove("brz-ed-arrow--bottom-center");
      corner.classList.add("brz-ed-arrow--top-center");
    }
    corner.style.left = `calc(50% + ${position.cornerLeftShift}px)`;
  };

  render() {
    const {
      arrow,
      items,
      node,
      onClick,
      onMouseEnter,
      onMouseLeave
    } = this.props;

    return (
      <ToolbarItems
        arrow={arrow}
        items={items}
        toolbarNode={node}
        onContentChange={this.reposition}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    );
  }
}

export default Toolbar;
