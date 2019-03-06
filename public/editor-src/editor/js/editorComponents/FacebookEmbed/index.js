import React from "react";
//import Config from "visual/global/Config";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import { styleClassName } from "./styles";
import Facebook from "visual/component/Facebook";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import defaultValue from "./defaultValue.json";

class FacebookEmbed extends EditorComponent {
  static get componentId() {
    return "FacebookEmbed";
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
    const {
      type,
      postAndVideoShowText,
      videoAllowFullScreen,
      videoAutoPlay,
      videoCaptions,
      postHref,
      videoHref
    } = v;
    const appData = this.getAppData();
    const data =
      type === "post"
        ? {
            width: "auto",
            showText: postAndVideoShowText === "on",
            href: postHref,
            lang: appData.lang
          }
        : {
            width: "auto",
            showText: postAndVideoShowText === "on",
            allowFullScreen: videoAllowFullScreen === "on",
            autoPlay: videoAutoPlay === "on",
            showCaptions: videoCaptions === "on",
            href: videoHref,
            lang: appData.lang
          };
    const t = type === "post" ? "EmbeddedPost" : "EmbeddedVideo";

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div className={styleClassName(v)}>
            <Facebook appId={appData.appId} type={t} data={data} />
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForView(v) {
    const {
      type,
      postAndVideoShowText,
      videoAllowFullScreen,
      videoAutoPlay,
      videoCaptions,
      postHref,
      videoHref
    } = v;
    const appData = this.getAppData();
    const data =
      type === "post"
        ? {
            "data-show-text": postAndVideoShowText === "on",
            "data-href": postHref,
            "data-lang": appData.lang
          }
        : {
            "data-width": "auto",
            "data-show-text": postAndVideoShowText === "on",
            "data-allowFullScreen": videoAllowFullScreen === "on",
            "data-autoplay": videoAutoPlay === "on",
            "data-show-captions": videoCaptions == "on",
            "data-href": videoHref,
            "data-lang": appData.lang
          };
    const t = type === "post" ? "post" : "video";

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <Facebook appId={appData.appId} type={t} data={data} />
      </CustomCSS>
    );
  }
}

export default FacebookEmbed;
