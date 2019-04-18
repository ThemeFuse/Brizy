import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import ContextMenu from "visual/component/ContextMenu";
import contextMenuConfig from "./contextMenu";
import Items from "./Items";
import * as toolbarConfig from "./toolbar";
import defaultValue from "./defaultValue.json";
import { styleClassName, styleCSSVars } from "./styles";
import * as parentToolbarExtend from "./parentExtendToolbar";

class Accordion extends EditorComponent {
  static get componentId() {
    return "Accordion";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig(parentToolbarExtend, {
      allowExtend: false,
      filterExtendName: `${this.constructor.componentId}_parent`
    });
    this.props.extendParentToolbar(toolbarExtend);
  }

  handleNav = activeAccordionItem => {
    this.patchValue({ activeAccordionItem });
  };

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.fontStyle && `${_v.fontStyle}__fsDesktop`,
      _v.tabletFontStyle && `${_v.tabletFontStyle}__fsTablet`,
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

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
          <Items {...itemProps} />
        </ContextMenu>
      </CustomCSS>
    );
  }
}

export default Accordion;
