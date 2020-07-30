import React, { useState } from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Config from "visual/global/Config";
import { PromptThirdParty } from "visual/component/Prompts/PromptThirdParty";
import { DynamicContent } from "visual/component/DynamicContent";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import toolbarConfigFn from "./toolbar";
import * as sidebarConfig from "./sidebar";
import { getStore } from "visual/redux/store";
import { pageSelector } from "visual/redux/selectors2";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import { t } from "visual/utils/i18n";

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
    const menusConfig = Config.get("menuData");

    return dbValue.menuName || menusConfig.length === 0
      ? dbValue
      : {
          ...dbValue,
          menuName: menusConfig[0].id
        };
  }

  renderErrors(v) {
    const menusConfig = Config.get("menuData");
    let errMsg;

    if (menusConfig.length === 0) {
      errMsg = (
        <CloudCreateMenuButton>{t("Create a menu")}</CloudCreateMenuButton>
      );
    }

    if (!errMsg) {
      const selectedMenu = menusConfig.find(menu => menu.id === v.menuName);

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
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );
    const errors = this.renderErrors(v);

    if (errors) {
      return IS_EDITOR ? errors : null;
    }

    const { menuName, tabletToggleMenu, mobileToggleMenu } = v;
    const toolbarConfig = toolbarConfigFn(Config.get("menuData"));

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <div className={className}>
          <DynamicContent
            placeholder={`{{brizy_dc_simple_menu id='${menuName}'}}`}
          >
            {({ status, data }) => {
              if (status === "success") {
                let ret = (
                  <div
                    className={IS_EDITOR ? "brz-blocked" : undefined}
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

function CloudCreateMenuButton({ children }) {
  if (IS_PREVIEW) {
    return null;
  }

  const [opened, setOpened] = useState(false);
  const siteUrl = Config.get("urls").site;
  const projectId = Config.get("project").id;
  const pageId = pageSelector(getStore().getState()).id;
  let iframeSrc = `${siteUrl}/projects/${projectId}/settings?page_id=${pageId}`;

  return (
    <>
      <a
        className="brz-a"
        href="#"
        onClick={e => {
          e.preventDefault();
          setOpened(true);
        }}
      >
        {children}
      </a>
      <PromptThirdParty
        iframeSrc={iframeSrc}
        opened={opened}
        onClose={() => setOpened(false)}
      />
    </>
  );
}
