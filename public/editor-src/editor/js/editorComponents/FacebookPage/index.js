// 5. Tablet si mobile nu e corect de facut review
// 8. De adaugat height din interfata
import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Facebook from "visual/component/Facebook";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { attachRefs } from "visual/utils/react";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

class FacebookPage extends EditorComponent {
  static defaultValue = defaultValue;

  static get componentId() {
    return "FacebookPage";
  }

  getAppData() {
    //const { social = [] } = Config.get("applications");
    //const facebook = social.find(({ service }) => service === "facebook");

    return {
      //appId: facebook && facebook.appid ? facebook.appid : "nick",

      appId: 113869198637480,
      lang: makePlaceholder({
        content: "{{ brizy_dc_page_language }}"
      })
    };
  }

  renderForEdit(v, vs, vd) {
    const { pageTabs, height, smallHeader, hideCover, showFacepile, href } = v;
    const appData = this.getAppData();
    const data = {
      width: "500",
      tabs: pageTabs,
      height,
      smallHeader: smallHeader === "on",
      hideCover: hideCover === "on",
      adaptContainerWidth: true,
      showFacepile: showFacepile === "on",
      href: href === "" ? "https://facebook.com/brizy.io" : href,
      lang: appData.lang
    };

    const className = classnames(
      "brz-fb-page",
      this.css(
        `${this.getComponentId()}`,
        `${this.getId()}`,
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            {({ ref: cssRef }) => (
              <div
                className={className}
                ref={(el) => {
                  attachRefs(el, [toolbarRef, cssRef]);
                }}
              >
                <Facebook
                  appId={appData.appId}
                  key={this.key}
                  type="Page"
                  data={data}
                  renderContext={this.props.renderContext}
                />
              </div>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }

  renderForView(v, vs, vd) {
    const { pageTabs, height, smallHeader, hideCover, showFacepile, href } = v;

    const appData = this.getAppData();
    const data = {
      ...makeDataAttr({ name: "width", value: "500" }),
      ...makeDataAttr({ name: "tabs", value: pageTabs }),
      ...makeDataAttr({ name: "height", value: height }),
      ...makeDataAttr({
        name: "small-header",
        value: String(smallHeader === "on")
      }),
      ...makeDataAttr({
        name: "hide-cover",
        value: String(hideCover === "on")
      }),
      ...makeDataAttr({ name: "adapt-container-width", value: "true" }),
      ...makeDataAttr({
        name: "show-facepile",
        value: String(showFacepile === "on")
      }),
      ...makeDataAttr({
        name: "href",
        value: href === "" ? "https://facebook.com/brizy.io" : href
      }),
      ...makeDataAttr({ name: "lang", value: appData.lang })
    };
    const className = classnames(
      "brz-fb-page",
      this.css(
        `${this.getComponentId()}`,
        `${this.getId()}`,
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={className}>
          <Facebook
            appId={appData.appId}
            type="Page"
            data={data}
            renderContext={this.props.renderContext}
          />
        </div>
      </CustomCSS>
    );
  }
}

export default FacebookPage;
