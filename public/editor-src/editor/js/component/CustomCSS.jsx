import React from "react";
import ReactDOM from "react-dom";
import { RenderFor } from "visual/providers/RenderProvider/RenderFor";
import {
  makeAttr,
  makeDataAttr,
  makeDataAttrString
} from "visual/utils/i18n/attribute";

let styles = {};

function toCSS(stylesObj) {
  return Object.entries(stylesObj).reduce((acc, [key, value]) => {
    acc += value.replace(
      /element/g,
      makeDataAttrString({ name: "custom-id", value: key })
    );
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
    const customIdAttr = makeAttr("custom-id");

    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);
    if (styles[selectorName] === css) {
      return;
    }

    if (!css) {
      node.removeAttribute(customIdAttr, selectorName);
      delete styles[selectorName];
    } else {
      node.setAttribute(customIdAttr, selectorName);
      styles[selectorName] = css;
    }

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

  renderForEdit() {
    // eslint-disable-next-line no-unused-vars
    const { selectorName, css, children, ...otherProps } = this.props;

    // React.cloneElement is done because <CustomCSS> is often rendered
    // inside of <SortableElement> which sends it's props that it expects
    // to be put on the DOM
    return React.cloneElement(React.Children.only(children), otherProps);
  }

  renderForView() {
    const { selectorName, css, children } = this.props;

    return (
      <div
        {...makeDataAttr({ name: "custom-id", value: selectorName })}
        {...makeDataAttr({
          name: "custom-css",
          value: toCSS({ [selectorName]: css })
        })}
      >
        {React.Children.only(children)}
      </div>
    );
  }

  render() {
    return (
      <RenderFor
        forView={this.renderForView()}
        forEdit={this.renderForEdit()}
      />
    );
  }
}
