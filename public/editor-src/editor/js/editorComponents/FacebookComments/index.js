// 1. Nu functioneaza href si lang cu valori randont trebuei sa fie language si href corecta. In alte elemente FB merge

import React from "react";
//import Config from "visual/global/Config";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import classnames from "classnames";
import { css } from "visual/utils/cssStyle";
import { style } from "./styles";
import Facebook from "visual/component/Facebook";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import defaultValue from "./defaultValue.json";

class FacebookComments extends EditorComponent {
  static get componentId() {
    return "FacebookComments";
  }

  static defaultValue = defaultValue;

  getAppData() {
    //const { social = [] } = Config.get("applications");
    //const facebook = social.find(({ service }) => service === "facebook");

    return {
      // appId: facebook && facebook.appid ? facebook.appid : "nick",

      appId: "nick",
      href: "{{ brizy_dc_current_page_unique_url }}",
      // href: "http://unimedia.md",

      lang: "{{ brizy_dc_page_language }}"
      // lang: "en_US"
    };
  }

  renderForEdit(v, vs, vd) {
    const { numPosts, darkScheme, targetUrl, href } = v;
    const appData = this.getAppData();
    const data = {
      width: "100%",
      numPosts,
      colorScheme: darkScheme === "on" ? "dark" : "light",
      href: "http://unimedia.md", // targetUrl === "custom" && href !== "" ? href : appData.href,
      lang: "en_US" //appData.lang
    };

    const className = classnames(
      "brz-fb-comments",
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
            <Facebook appId={appData.appId} type="Comments" data={data} />
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForView(v, vs, vd) {
    const { numPosts, darkScheme, targetUrl, href } = v;
    const appData = this.getAppData();
    const data = {
      "data-width": "100%",
      "data-numposts": numPosts,
      "data-colorscheme": darkScheme === "on" ? "dark" : "light",
      "data-href": targetUrl === "custom" && href !== "" ? href : appData.href,
      "data-lang": appData.lang
    };

    const className = classnames(
      "brz-fb-comments",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={className}>
          <Facebook appId={appData.appId} type="Comments" data={data} />
        </div>
      </CustomCSS>
    );
  }
}

export default FacebookComments;
