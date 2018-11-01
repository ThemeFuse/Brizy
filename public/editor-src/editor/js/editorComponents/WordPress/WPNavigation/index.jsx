import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { WPShortcode } from "../common/WPShortcode";
import Toolbar from "visual/component-new/Toolbar";
import toolbarConfigFn from "./toolbar";
import defaultValue from "./defaultValue.json";
import { styleClassName, styleCSSVars } from "./styles";
import * as Api from "visual/utils/api/editor/index";

class WPNavigation extends EditorComponent {
  static get componentId() {
    return "WPNavigation";
  }

  static defaultValue = defaultValue;

  state = {
    menus: []
  };

  componentDidMount() {
    Api.getMenus().then(menus => {
      this.setState({ menus });

      const v = this.getValue();
      if (v.menuName === "" && menus.length > 0) {
        this.patchValue({ menuName: menus[0].slug });
      }
    });
  }

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.colorPalette && `${_v.colorPalette}__color`,
      _v.fontStyle && `${_v.fontStyle}__fsDesktop`,
      _v.tabletFontStyle && `${_v.tabletFontStyle}__fsTablet`,
      _v.mobileFontStyle && `${_v.mobileFontStyle}__fsMobile`
    ]);
    const attributes = {
      name: v.menuName
    };
    const toolbarConfig = toolbarConfigFn(this.state.menus);

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
        <WPShortcode
          name="brizy_navigation"
          attributes={attributes}
          placeholderIcon="wp-shortcode"
          className={styleClassName(v)}
          style={styleCSSVars(v)}
          mobileToggleMenu={v.mobileToggleMenu === "on"}
          tabletToggleMenu={v.tabletToggleMenu === "on"}
        />
      </Toolbar>
    );
  }
}

export default WPNavigation;
