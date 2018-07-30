import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import ContainerBorder from "visual/component-new/ContainerBorder";
import Items from "./Items";
import * as toolbarConfig from "./toolbar";
import defaultValue from "./defaultValue.json";
import { styleClassName, styleCSSVars } from "./styles";

class Tabs extends EditorComponent {
  static get componentId() {
    return "Tabs";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  handleNav = activeTab => {
    this.patchValue({ activeTab });
  };

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.bgColorPalette && `${_v.bgColorPalette}__bg`,
      _v.colorPalette && `${_v.colorPalette}__color`,
      _v.borderColorPalette && `${_v.borderColorPalette}__border`,
      _v.fontStyle && `${_v.fontStyle}__fsDesktop`,
      _v.mobileFontStyle && `${_v.mobileFontStyle}__fsMobile`
    ]);

    const { activeTab } = v;
    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      className: styleClassName(v),
      style: styleCSSVars(v),
      handleNav: this.handleNav,
      activeTab,
      meta: this.props.meta,
      toolbarExtend: this.makeToolbarPropsFromConfig(toolbarConfig)
    });

    return <Items {...itemProps} />;
  }
}

export default Tabs;
