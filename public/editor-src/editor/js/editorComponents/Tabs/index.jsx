import React from "react";
import { noop } from "underscore";
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

  static defaultProps = {
    extendParentToolbar: noop
  };

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      parentToolbarExtend,
      {
        allowExtend: false,
        filterExtendName: `${this.constructor.componentId}_parent`
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  handleNav = activeTab => {
    this.patchValue({ activeTab });
  };

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.fontStyle && `${_v.fontStyle}__fsDesktop`,
      _v.tabletFontStyle && `${_v.tabletFontStyle}__fsTablet`,
      _v.mobileFontStyle && `${_v.mobileFontStyle}__fsMobile`
    ]);

    const { activeTab, iconName, iconType, iconPosition } = v;
    const itemNavProps = this.makeSubcomponentProps({
      activeTab,
      iconName,
      iconType,
      iconPosition,
      bindWithKey: "items",
      renderType: "nav",
      onChangeNav: this.handleNav,
      meta: this.props.meta,
      toolbarExtend: this.makeToolbarPropsFromConfig2(toolbarConfig, {
        allowExtend: false
      })
    });
    const itemContentProps = this.makeSubcomponentProps({
      activeTab,
      iconName,
      iconType,
      iconPosition,
      bindWithKey: "items",
      renderType: "content",
      onChangeNav: this.handleNav,
      meta: this.props.meta,
      toolbarExtend: this.makeToolbarPropsFromConfig2(toolbarConfig, {
        allowExtend: false
      })
    });
    const className = styleClassName(v);
    const style = styleCSSVars(v);

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
          <div className={className} style={style}>
            <ul className="brz-tabs__nav">
              <Items {...itemNavProps} />
            </ul>
            <div className="brz-tabs__content">
              <Items {...itemContentProps} />
            </div>
          </div>
        </ContextMenu>
      </CustomCSS>
    );
  }
}

export default Tabs;
