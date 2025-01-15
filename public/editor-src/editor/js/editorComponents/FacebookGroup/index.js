import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Facebook from "visual/component/Facebook";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

class FacebookGroup extends EditorComponent {
  static get componentId() {
    return "FacebookGroup";
  }

  static defaultValue = defaultValue;

  getAppData() {
    return {
      appId: 113869198637480,
      lang: makePlaceholder({
        content: "{{ brizy_dc_page_language }}"
      })
    };
  }

  renderForEdit(v, vs, vd) {
    const { width, href, showSocialContext, showMetaData, skin } = v;
    const appData = this.getAppData();
    const data = {
      width,
      href: href === "" ? "https://www.facebook.com/groups/brizy/" : href,
      showSocialContext: showSocialContext === "on",
      showMetaData: showMetaData === "on",
      skin,
      lang: appData.lang
    };
    const className = classnames(
      "brz-fb-group",
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
              type="Group"
              data={data}
              renderContext={this.renderContext}
            />
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForView(v, vs, vd) {
    const { width, href, showSocialContext, showMetaData, skin } = v;

    const appData = this.getAppData();
    const data = {
      ...makeDataAttr({ name: "width", value: width }),
      ...makeDataAttr({
        name: "href",
        value: href === "" ? "https://www.facebook.com/groups/brizy/" : href
      }),
      ...makeDataAttr({
        name: "show-social-context",
        value: String(showSocialContext === "on")
      }),
      ...makeDataAttr({
        name: "show-metadata",
        value: String(showMetaData === "on")
      }),
      ...makeDataAttr({ name: "skin", value: skin }),
      ...makeDataAttr({
        name: "lang",
        value: appData.lang
      })
    };
    const className = classnames(
      "brz-fb-group",
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
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={className}>
          <Facebook
            appId={appData.appId}
            type="Group"
            data={data}
            renderContext={this.renderContext}
          />
        </div>
      </CustomCSS>
    );
  }
}

export default FacebookGroup;
