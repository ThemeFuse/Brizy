import React from "react";
import ReactDOM from "react-dom";
import classnames from "classnames";

let styles = {};

function toCSS(stylesObj) {
  return Object.entries(stylesObj).reduce((acc, [key, value]) => {
    acc += value.replace(/element/g, `[data-custom-id=${key}]`);
    return acc;
  }, "");
}

export default class CustomCSS extends React.Component {
  static defaultProps = {
    selectorName: "",
    css: ""
  };

  componentWillUnmount() {
    const { selectorName } = this.props;

    delete styles[selectorName];
  }

  componentDidMount() {
    this.updateCSS();
  }

  updateCSS() {
    const { selectorName, css } = this.props;
    const node = ReactDOM.findDOMNode(this);
    if (!css || styles[selectorName] === css) {
      return;
    }

    node.setAttribute("data-custom-id", selectorName);
    styles[selectorName] = css;

    let styleNODE = document.getElementById("custom-css");
    if (!styleNODE) {
      styleNODE = document.createElement("style");

      styleNODE.id = "custom-css";
      styleNODE.innerHTML = toCSS(styles);
      document.head.appendChild(styleNODE);
    } else {
      styleNODE.innerHTML = toCSS(styles);
    }
  }

  componentDidUpdate() {
    this.updateCSS();
  }

  render() {
    const { children } = this.props;
    if (IS_PREVIEW) {
      const { selectorName, css } = this.props;

      return (
        <div
          data-custom-id={selectorName}
          data-custom-css={toCSS({ [selectorName]: css })}
        >
          {children}
        </div>
      );
    }

    return children;
  }
}
