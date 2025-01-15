import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Facebook from "visual/component/Facebook";
import Toolbar from "visual/component/Toolbar";
//import Config from "visual/global/Config";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

class FacebookButton extends EditorComponent {
  static get componentId() {
    return "FacebookButton";
  }

  static defaultValue = defaultValue;

  getAppData() {
    //const { social = [] } = Config.get("applications");
    //const facebook = social.find(({ service }) => service === "facebook");

    return {
      //appId: facebook && facebook.appid ? facebook.appid : "nick",

      appId: 113869198637480,
      href: makePlaceholder({
        content: "{{ brizy_dc_current_page_unique_url }}"
      }),
      lang: makePlaceholder({
        content: "{{ brizy_dc_page_language }}"
      })
    };
  }

  renderForEdit(v, vs, vd) {
    const {
      type,
      layout,
      size,
      share,
      showCounter,
      showFriends,
      darkScheme,
      targetUrl,
      href
    } = v;
    const appData = this.getAppData();
    const data = {
      action: type,
      layout:
        layout === "button"
          ? showFriends === "on"
            ? "standard"
            : showCounter === "on"
              ? "button_count"
              : "button"
          : "box_count",
      size,
      share: share === "on",
      showFaces: showFriends === "on",
      colorScheme: darkScheme === "on" ? "dark" : "light",
      href: targetUrl === "custom" && href !== "" ? href : appData.href,
      lang: appData.lang
    };

    const className = classnames(
      "brz-fb-like",
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

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div className={className}>
            <Facebook
              appId={appData.appId}
              type="Like"
              data={data}
              renderContext={this.renderContext}
            />
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForView(v, vs, vd) {
    const {
      type,
      layout,
      size,
      share,
      showCounter,
      showFriends,
      darkScheme,
      targetUrl,
      href,
      customCSS
    } = v;
    const appData = this.getAppData();

    const data = {
      ...makeDataAttr({ name: "action", value: type }),
      ...makeDataAttr({
        name: "layout",
        value:
          layout === "button"
            ? showFriends === "on"
              ? "standard"
              : showCounter === "on"
                ? "button_count"
                : "button"
            : "box_count"
      }),
      ...makeDataAttr({ name: "size", value: size }),
      ...makeDataAttr({ name: "share", value: share }),
      ...makeDataAttr({ name: "show-faces", value: showFriends }),
      ...makeDataAttr({
        name: "colorscheme",
        value: darkScheme === "on" ? "dark" : "light"
      }),
      ...makeDataAttr({
        name: "href",
        value: targetUrl === "custom" && href !== "" ? href : appData.href
      }),
      ...makeDataAttr({ name: "lang", value: appData.lang })
    };
    const className = classnames(
      "brz-fb-like",
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

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <div className={className}>
          <Facebook
            appId={appData.appId}
            type="Like"
            data={data}
            renderContext={this.renderContext}
          />
        </div>
      </CustomCSS>
    );
  }
}

export default FacebookButton;
