import _ from "underscore";
import React from "react";
import { toCSSString } from "visual/helper/utils/Dom/arrayToCSS";

let dom = {};

function init(v) {
  if (v && IS_EDITOR) {
    dom = new renderStyle();
    dom.init();
  }
}

class renderStyle {
  constructor(state) {
    this.state = [];
    this.node = null;
  }
  init() {
    const style = document.createElement("style");
    style.type = "text/css";
    document.getElementsByTagName("head")[0].appendChild(style);
    this.node = style;
  }
  setState(newValue) {
    this.state.push(newValue);
    this.render(this.state);
  }
  render(value) {
    const css = toCSSString(value, "selector");
    this.node.innerText = css;
  }
}

export default class CSSPortal extends React.Component {
  static defaultProps = {
    value: null
  };

  componentDidMount() {
    if (!dom.node) {
      init(true);
    }
    this.innerDom = dom;
    this.innerDom.setState(this.props.value);
  }

  componentWillReceiveProps(nextProps) {
    const propsColor = this.props.value;

    if (propsColor !== nextProps.value) {
      this.innerDom.setState(nextProps.value);
    }
  }

  render() {
    return null;
  }
}
