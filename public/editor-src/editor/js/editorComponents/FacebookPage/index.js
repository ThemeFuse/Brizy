// 5. Tablet si mobile nu e corect de facut review
// 8. De adaugat height din interfata

import React from "react";
//import Config from "visual/global/Config";
import _ from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import { styleClassName } from "./styles";
import Facebook from "visual/component/Facebook";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import defaultValue from "./defaultValue.json";

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

      appId: "nick",
      lang: "{{ brizy_dc_page_language }}"
    };
  }

  renderForEdit(v) {
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

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div className={styleClassName(v)}>
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

  renderForView(v) {
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

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <Facebook appId={appData.appId} type="Page" data={data} />
      </CustomCSS>
    );
  }
}

export default FacebookPage;
