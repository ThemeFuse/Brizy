import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { WPShortcode } from "../common/WPShortcode";
import Toolbar from "visual/component/Toolbar";
import { getMenus } from "visual/utils/api/editor/index";
import toolbarConfigFn from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import { styleClassName, styleCSSVars } from "./styles";

class WPNavigation extends EditorComponent {
  static get componentId() {
    return "WPNavigation";
  }

  static defaultValue = defaultValue;

  state = {
    menus: []
  };

  componentDidMount() {
    getMenus().then(menus => {
      this.setState({ menus });

      const v = this.getValue();
      if (v.menuName === "" && menus.length > 0) {
        this.patchValue({ menuName: menus[0].slug });
      }
    });
  }

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.fontStyle && `${_v.fontStyle}__fsDesktop`,
      _v.tabletFontStyle && `${_v.tabletFontStyle}__fsTablet`,
      _v.mobileFontStyle && `${_v.mobileFontStyle}__fsMobile`
    ]);
    const attributes = {
      name: v.menuName
    };
    const toolbarConfig = toolbarConfigFn(this.state.menus);

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
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
