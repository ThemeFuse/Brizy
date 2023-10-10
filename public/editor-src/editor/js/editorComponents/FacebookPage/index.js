// 5. Tablet si mobile nu e corect de facut review
// 8. De adaugat height din interfata
import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Facebook from "visual/component/Facebook";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { css } from "visual/utils/cssStyle";
import { makePlaceholder } from "visual/utils/dynamicContent";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

class FacebookPage extends EditorComponent {
  static get componentId() {
    return "FacebookPage";
  }

  static defaultValue = defaultValue;

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
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
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
              key={this.key}
              type="Page"
              data={data}
            />
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForView(v, vs, vd) {
    const { pageTabs, height, smallHeader, hideCover, showFacepile, href } = v;
    const appData = this.getAppData();
    const data = {
      "data-width": "500",
      "data-tabs": pageTabs,
      "data-height": height,
      "data-small-header": smallHeader === "on",
      "data-hide-cover": hideCover === "on",
      "data-adapt-container-width": true,
      "data-show-facepile": showFacepile === "on",
      "data-href": href === "" ? "https://facebook.com/brizy.io" : href,
      "data-lang": appData.lang
    };
    const className = classnames(
      "brz-fb-page",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={className}>
          <Facebook appId={appData.appId} type="Page" data={data} />
        </div>
      </CustomCSS>
    );
  }
}

export default FacebookPage;
