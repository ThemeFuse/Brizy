import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Facebook from "visual/component/Facebook";
import Toolbar from "visual/component/Toolbar";
//import Config from "visual/global/Config";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { attachRefs } from "visual/utils/react";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

class FacebookEmbed extends EditorComponent {
  static defaultValue = defaultValue;

  static get componentId() {
    return "FacebookEmbed";
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

    const className = classnames(
      "brz-fb-embed",
      this.css(
        this.getComponentId(),
        this.getId(),
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
                  type={t}
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
            ...makeDataAttr({
              name: "show-text",
              value: String(postAndVideoShowText === "on")
            }),
            ...makeDataAttr({ name: "href", value: postHref }),
            ...makeDataAttr({ name: "lang", value: appData.lang })
          }
        : {
            ...makeDataAttr({ name: "width", value: "auto" }),
            ...makeDataAttr({
              name: "show-text",
              value: String(postAndVideoShowText === "on")
            }),
            ...makeDataAttr({
              name: "allowFullScreen",
              value: String(videoAllowFullScreen === "on")
            }),
            ...makeDataAttr({
              name: "autoplay",
              value: String(videoAutoPlay === "on")
            }),
            ...makeDataAttr({
              name: "show-captions",
              value: String(videoCaptions === "on")
            }),
            ...makeDataAttr({ name: "href", value: videoHref }),
            ...makeDataAttr({ name: "lang", value: appData.lang })
          };
    const t = type === "post" ? "post" : "video";

    const className = classnames(
      "brz-fb-embed",
      this.css(
        this.getComponentId(),
        this.getId(),
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
            type={t}
            data={data}
            renderContext={this.props.renderContext}
          />
        </div>
      </CustomCSS>
    );
  }
}

export default FacebookEmbed;
