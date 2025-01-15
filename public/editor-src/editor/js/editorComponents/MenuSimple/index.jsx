import classnames from "classnames";
import React from "react";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContent } from "visual/editorComponents/EditorComponent/DynamicContent/DynamicContent";
import { isEditor } from "visual/providers/RenderProvider";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { t } from "visual/utils/i18n";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import toolbarConfigFn from "./toolbar";

export default class MenuSimple extends EditorComponent {
  static get componentId() {
    // NOTE: initially we only had MenuSimple (then called WPNavigation) for WordPress.
    // After we needed to make it work for cloud as well, it was renamed to SimpleMenu,
    // but since we don't have a good migration system yet, the old componentId still remains
    return "WPNavigation";
  }

  static defaultValue = defaultValue;

  getDBValue() {
    const dbValue = super.getDBValue();
    const menusConfig = this.getGlobalConfig().menuData;

    return dbValue.menuName || menusConfig.length === 0
      ? dbValue
      : {
          ...dbValue,
          menuName: menusConfig[0].id
        };
  }

  renderErrors(v) {
    const config = this.getGlobalConfig();
    const { menuData: menusConfig, elements } = config;
    let errMsg;

    if (menusConfig.length === 0 && isEditor(this.renderContext)) {
      const { menu } = elements ?? {};
      const { onOpen, createMenuLabel = t("Create a menu") } = menu ?? {};

      errMsg = (
        <CloudCreateMenuButton onOpen={onOpen}>
          {createMenuLabel}
        </CloudCreateMenuButton>
      );
    }

    if (!errMsg) {
      const selectedMenu = menusConfig.find((menu) => menu.id === v.menuName);

      if (!selectedMenu) {
        errMsg = t("Select a menu from the element options");
      }
    }

    return errMsg && <div className="brz-menu__error">{errMsg}</div>;
  }

  renderForEdit(v, vs, vd) {
    const className = classnames(
      "brz-menu-simple",
      "brz-menu-simple--cloud",
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
    );
    const errors = this.renderErrors(v);

    if (errors) {
      return isEditor(this.renderContext) ? errors : null;
    }

    const { menuName, tabletToggleMenu, mobileToggleMenu } = v;
    const toolbarConfig = toolbarConfigFn(this.getGlobalConfig().menuData);
    const placeholder = makePlaceholder({
      content: "{{ brizy_dc_simple_menu }}",
      attr: { menuId: menuName }
    });

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <div className={className}>
          <DynamicContent
            placeholder={placeholder}
            renderContext={this.renderContext}
          >
            {({ status, data }) => {
              if (status === "success") {
                let ret = (
                  <div
                    className={
                      isEditor(this.renderContext) ? "brz-blocked" : undefined
                    }
                    dangerouslySetInnerHTML={{
                      __html: data
                    }}
                  />
                );

                if (tabletToggleMenu === "on" || mobileToggleMenu === "on") {
                  const toggleClassName = classnames(
                    "brz-menu-simple__toggle",
                    {
                      "brz-menu-simple__toggle--tablet":
                        tabletToggleMenu === "on",
                      "brz-menu-simple__toggle--mobile":
                        mobileToggleMenu === "on"
                    }
                  );
                  const toggleId = `brz-menu-simple__btn-${this.getId().slice(
                    0,
                    5
                  )}`;

                  ret = (
                    <div className={toggleClassName}>
                      <input
                        className="brz-input"
                        id={toggleId}
                        type="checkbox"
                      />
                      <label
                        className="brz-menu-simple__icon"
                        htmlFor={toggleId}
                      >
                        <span className="brz-menu-simple__icon--bars" />
                      </label>
                      {ret}
                    </div>
                  );
                }

                return ret;
              }

              return (
                <Placeholder
                  icon="menu-3"
                  style={{
                    minHeight: "50px",
                    height: "50px"
                  }}
                />
              );
            }}
          </DynamicContent>
        </div>
      </Toolbar>
    );
  }
}

const CloudCreateMenuButton = ({ children, onOpen }) => (
  <span className="brz-a" onClick={onOpen}>
    {children}
  </span>
);
