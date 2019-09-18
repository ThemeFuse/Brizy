import React from "react";
//import Config from "visual/global/Config";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import Facebook from "visual/component/Facebook";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import defaultValue from "./defaultValue.json";
import classnames from "classnames";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";

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

      appId: "nick",
      href: "{{ brizy_dc_current_page_unique_url }}",
      lang: "{{ brizy_dc_page_language }}"
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
      "brz-facebook",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div className={className}>
            <Facebook appId={appData.appId} type="Like" data={data} />
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
      href
    } = v;
    const appData = this.getAppData();
    const data = {
      "data-action": type,
      "data-layout":
        layout === "button"
          ? showFriends === "on"
            ? "standard"
            : showCounter === "on"
            ? "button_count"
            : "button"
          : "box_count",
      "data-size": size,
      "data-share": share,
      "data-show-faces": showFriends,
      "data-colorscheme": darkScheme === "on" ? "dark" : "light",
      "data-href": targetUrl === "custom" && href !== "" ? href : appData.href,
      "data-lang": appData.lang
    };
    const className = classnames(
      "brz-facebook",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={className}>
          <Facebook appId={appData.appId} type="Like" data={data} />
        </div>
      </CustomCSS>
    );
  }
}

export default FacebookButton;
