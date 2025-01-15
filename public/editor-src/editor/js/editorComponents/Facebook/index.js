import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import FacebookPlugin from "visual/component/Facebook";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { defaultValueValue } from "visual/utils/onChange";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

class Facebook extends EditorComponent {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId() {
    return "Facebook";
  }

  dvv = (key) => {
    const v = this.getValue();
    const device = this.getDeviceMode();

    return defaultValueValue({ v, key, device });
  };

  getAppData() {
    return {
      appId: 113869198637480,
      href: makePlaceholder({
        content: "{{ brizy_dc_current_page_unique_url }}"
      }),
      lang: makePlaceholder({
        content: "{{ brizy_dc_page_language }}"
      })
    };
  }

  tabs = (v) => {
    const { pageTabs } = v;

    try {
      return JSON.parse(pageTabs);
    } catch {
      return pageTabs;
    }
  };

  renderForEdit(v, vs, vd) {
    const {
      className: _className,
      facebookType,
      targetUrl,
      href,
      facebookButtonType,
      layout,
      size,
      share,
      showFriends,
      showCounter,
      facebookEmbedType,
      facebookEmbedPostHref,
      facebookEmbedVideoHref,
      postAndVideoShowText,
      facebookEmbedVideoAllowFullScreen,
      facebookEmbedVideoAutoPlay,
      facebookEmbedVideoCaptions,
      facebookPageHref,
      height,
      smallHeader,
      hideCover,
      showFacepile,
      facebookGroupHref,
      skin,
      showSocialContext,
      showMetaData,
      customCSS
    } = v;

    const width = this.dvv("width");
    const pageWidth = this.dvv("pageWidth");

    const className = classnames(
      "brz-fb",
      `brz-fb-${facebookType === "button" ? "like" : facebookType}`,
      { "brz-fb-styles": facebookType !== "button" },
      { "brz-fb-styles-button": facebookType === "button" },
      {
        [`brz-fb-styles-button--small-${layout}`]:
          facebookType === "button" && size === "small"
      },
      _className,
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

    const appData = this.getAppData();

    const typeData = {
      button: "Like",
      embed: facebookEmbedType === "post" ? "EmbeddedPost" : "EmbeddedVideo",
      page: "Page",
      group: "Group"
    };

    const data = {
      button: {
        href: targetUrl === "custom" && href !== "" ? href : appData.href,
        action: facebookButtonType,
        layout:
          layout === "button"
            ? showFriends === "on"
              ? "standard"
              : showCounter === "on"
                ? "button_count"
                : "button"
            : "box_count",
        showFaces: showFriends === "on",
        size,
        share: share === "on",
        lang: appData.lang
      },
      embed:
        facebookEmbedType === "post"
          ? {
              width: "auto",
              href: facebookEmbedPostHref,
              showText: postAndVideoShowText === "on",
              lang: appData.lang
            }
          : {
              width: "auto",
              href: facebookEmbedVideoHref,
              showText: postAndVideoShowText === "on",
              allowFullScreen: facebookEmbedVideoAllowFullScreen === "on",
              autoPlay: facebookEmbedVideoAutoPlay === "on",
              showCaptions: facebookEmbedVideoCaptions === "on",
              lang: appData.lang
            },
      page: {
        width: pageWidth,
        href:
          facebookPageHref === ""
            ? "https://www.facebook.com/techcrunch/"
            : facebookPageHref,
        tabs: this.tabs(v),
        height,
        smallHeader: smallHeader === "on",
        hideCover: hideCover === "on",
        showFacepile: showFacepile === "on",
        adaptContainerWidth: true,
        lang: appData.lang
      },
      group: {
        width,
        href:
          facebookGroupHref === ""
            ? "https://www.facebook.com/groups/669915249871846"
            : facebookGroupHref,
        skin,
        showSocialContext: showSocialContext === "on",
        showMetaData: showMetaData === "on",
        lang: appData.lang
      }
    };

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={customCSS}>
          <Wrapper {...this.makeWrapperProps({ className })}>
            <FacebookPlugin
              renderContext={this.renderContext}
              appId={appData.appId}
              type={typeData[facebookType]}
              data={data[facebookType]}
            />
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForView(v, vs, vd) {
    const {
      className: _className,
      facebookType,
      targetUrl,
      href,
      facebookButtonType,
      layout,
      size,
      share,
      showFriends,
      showCounter,
      facebookEmbedType,
      postAndVideoShowText,
      facebookEmbedPostHref,
      facebookEmbedVideoHref,
      facebookEmbedVideoAllowFullScreen,
      facebookEmbedVideoAutoPlay,
      facebookEmbedVideoCaptions,
      facebookPageHref,
      height,
      smallHeader,
      hideCover,
      showFacepile,
      facebookGroupHref,
      showSocialContext,
      showMetaData,
      skin,
      customCSS
    } = v;

    const width = this.dvv("width");
    const pageWidth = this.dvv("pageWidth");

    const className = classnames(
      "brz-fb",
      `brz-fb-${facebookType === "button" ? "like" : facebookType}`,
      { "brz-fb-styles": facebookType !== "button" },
      { "brz-fb-styles-button": facebookType === "button" },
      {
        [`brz-fb-styles-button--small-${layout}`]:
          facebookType === "button" && size === "small"
      },
      _className,
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

    const appData = this.getAppData();

    const data = {
      button: {
        "data-href":
          targetUrl === "custom" && href !== "" ? href : appData.href,
        "data-action": facebookButtonType,
        "data-layout":
          layout === "button"
            ? showFriends === "on"
              ? "standard"
              : showCounter === "on"
                ? "button_count"
                : "button"
            : "box_count",
        "data-show-faces": showFriends,
        "data-size": size,
        "data-share": share,
        "data-lang": appData.lang,
        "data-colorscheme": "dark"
      },
      embed:
        facebookEmbedType === "post"
          ? {
              "data-width": "auto",
              "data-show-text": postAndVideoShowText === "on",
              "data-href": facebookEmbedPostHref,
              "data-lang": appData.lang
            }
          : {
              "data-width": "auto",
              "data-show-text": postAndVideoShowText === "on",
              "data-allowFullScreen":
                facebookEmbedVideoAllowFullScreen === "on",
              "data-autoplay": facebookEmbedVideoAutoPlay === "on",
              "data-show-captions": facebookEmbedVideoCaptions === "on",
              "data-href": facebookEmbedVideoHref,
              "data-lang": appData.lang
            },
      page: {
        "data-width": pageWidth,
        "data-tabs": this.tabs(v),
        "data-height": height,
        "data-small-header": smallHeader === "on",
        "data-hide-cover": hideCover === "on",
        "data-adapt-container-width": true,
        "data-show-facepile": showFacepile === "on",
        "data-href":
          facebookPageHref === ""
            ? "https://www.facebook.com/techcrunch/"
            : facebookPageHref,
        "data-lang": appData.lang
      },
      group: {
        "data-width": width,
        "data-href":
          facebookGroupHref === ""
            ? "https://www.facebook.com/groups/669915249871846"
            : facebookGroupHref,
        "data-show-social-context": showSocialContext === "on",
        "data-show-metadata": showMetaData === "on",
        "data-skin": skin,
        "data-lang": appData.lang
      }
    };

    const typeData = {
      button: "Like",
      embed: facebookEmbedType === "post" ? "post" : "video",
      page: "Page",
      group: "Group"
    };

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <div className={className}>
          <FacebookPlugin
            renderContext={this.renderContext}
            appId={appData.appId}
            type={typeData[facebookType]}
            data={data[facebookType]}
          />
        </div>
      </CustomCSS>
    );
  }
}

export default Facebook;
