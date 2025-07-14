import classnames from "classnames";
import React from "react";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { getMenus } from "visual/utils/api";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { DCMenuProxyInstance } from "./DC/DCMenuProxyInstance";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import toolbarConfigFn from "./toolbar";

export default class MenuSimpleWP extends EditorComponent {
  static defaultValue = defaultValue;
  state = {
    menus: []
  };

  static get componentId() {
    // NOTE: initially we only had MenuSimple (then called WPNavigation) for WordPress.
    // After we needed to make it work for cloud as well, it was renamed to SimpleMenu,
    // but since we don't have a good migration system yet, the old componentId still remains
    return "WPNavigation";
  }

  componentDidMount() {
    getMenus(this.getGlobalConfig().api).then((menus) => {
      this.setState({ menus });

      const v = this.getValue();
      if (v.menuName === "" && menus.length > 0) {
        this.patchValue({ menuName: menus[0].slug });
      }
    });
  }

  renderForEdit(v, vs, vd) {
    const className = classnames(
      "brz-menu-simple",
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const { tabletToggleMenu, mobileToggleMenu } = v;
    const toolbarConfig = toolbarConfigFn(this.state.menus);
    const placeholder = makePlaceholder({
      content: "{{ editor_navigation }}",
      attr: { menuId: v.menuName }
    });

    let content = (
      <DynamicContentHelper
        placeholder={placeholder}
        tagName="div"
        blocked={false}
        fetcher={DCMenuProxyInstance}
      />
    );

    if (tabletToggleMenu === "on" || mobileToggleMenu === "on") {
      const toggleClassName = classnames("brz-menu-simple__toggle", {
        "brz-menu-simple__toggle--tablet": tabletToggleMenu === "on",
        "brz-menu-simple__toggle--mobile": mobileToggleMenu === "on"
      });
      const toggleId = `brz-menu-simple__btn-${this.getId().slice(0, 5)}`;

      content = (
        <div className={toggleClassName}>
          <input className="brz-input" id={toggleId} type="checkbox" />
          <label className="brz-menu-simple__icon" htmlFor={toggleId}>
            <span className="brz-menu-simple__icon--bars" />
          </label>
          {content}
        </div>
      );
    }

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        {({ ref }) => (
          <div className={className} ref={ref}>
            {content}
          </div>
        )}
      </Toolbar>
    );
  }
}
