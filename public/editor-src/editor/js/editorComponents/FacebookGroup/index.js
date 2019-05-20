import React from "react";
import _ from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import { styleClassName, styleCSSVars } from "./styles";
import Facebook from "visual/component/Facebook";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import defaultValue from "./defaultValue.json";

class FacebookGroup extends EditorComponent {
  static get componentId() {
    return "FacebookGroup";
  }

  static defaultValue = defaultValue;

  getAppData() {
    return {
      appId: 113869198637480,
      lang: "{{ brizy_dc_group_language }}"
    };
  }

  renderForEdit(v) {
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
    return (
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div className={styleClassName(v)} style={styleCSSVars(v)}>
            <Facebook appId={appData.appId} type="Group" data={data} />
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForView(v) {
    const { width, href, showSocialContext, showMetaData, skin } = v;
    const appData = this.getAppData();
    const data = {
      "data-width": width,
      "data-href":
        href === "" ? "https://www.facebook.com/groups/brizy/" : href,
      "data-show-social-context": showSocialContext === "on",
      "data-show-metadata": showMetaData === "on",
      "data-skin": skin,
      "data-lang": appData.lang
    };
    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={styleClassName(v)} style={styleCSSVars(v)}>
          <Facebook appId={appData.appId} type="Group" data={data} />
        </div>
      </CustomCSS>
    );
  }
}

export default FacebookGroup;
