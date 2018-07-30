import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Background from "visual/component-new/Background";
import ItemItems from "./ItemItems";
import defaultValue from "./itemDefaultValue.json";

class Tab extends EditorComponent {
  static get componentId() {
    return "Tab";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  renderForEdit(v) {
    const {
      customClassName,
      bgImageSrc,
      bgColorOpacity,
      mobileBgImageSrc,
      mobileBgColorOpacity
    } = v;

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      className: "brz-tab",
      meta: this.props.meta
    });

    const bgProps = {
      className: customClassName,
      imageSrc: bgImageSrc,
      colorOpacity: bgColorOpacity,
      mobileImageSrc: mobileBgImageSrc,
      mobileColorOpacity: mobileBgColorOpacity
    };

    return (
      <Background {...bgProps}>
        <ItemItems {...itemsProps} />
      </Background>
    );
  }
}

export default Tab;
