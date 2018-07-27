import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Items from "./Items";
import * as toolbarConfig from "./toolbar";
import defaultValue from "./defaultValue.json";
import { styleClassName, styleCSSVars } from "./styles";

class Accordion extends EditorComponent {
  static get componentId() {
    return "Accordion";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  handleNav = activeAccordionItem => {
    this.patchValue({ activeAccordionItem });
  };

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.bgColorPalette && `${_v.bgColorPalette}__bg`,
      _v.colorPalette && `${_v.colorPalette}__color`,
      _v.borderColorPalette && `${_v.borderColorPalette}__border`,
      _v.fontStyle && `${_v.fontStyle}__fsDesktop`,
      _v.mobileFontStyle && `${_v.mobileFontStyle}__fsMobile`
    ]);

    const { activeAccordionItem } = v;
    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      className: styleClassName(v),
      style: styleCSSVars(v),
      handleNav: this.handleNav,
      activeAccordionItem,
      meta: this.props.meta,
      toolbarExtend: this.makeToolbarPropsFromConfig(toolbarConfig)
    });

    return <Items {...itemProps} />;
  }
}

export default Accordion;
