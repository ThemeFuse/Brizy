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

class Tabs extends EditorComponent {
  static get componentId() {
    return "Tabs";
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

  handleNav = activeTab => {
    this.patchValue({ activeTab });
  };

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.bgColorPalette && `${_v.bgColorPalette}__bg`,
      _v.colorPalette && `${_v.colorPalette}__color`,
      _v.borderColorPalette && `${_v.borderColorPalette}__border`,
      _v.fontStyle && `${_v.fontStyle}__fsDesktop`,
      _v.tabletFontStyle && `${_v.tabletFontStyle}__fsTablet`,
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

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
          <Items {...itemProps} />
        </ContextMenu>
      </CustomCSS>
    );
  }
}

export default Tabs;
