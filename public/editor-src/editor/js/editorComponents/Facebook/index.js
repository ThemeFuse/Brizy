import React from "react";
//import Config from "visual/global/Config";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import FacebookPlugin from "visual/component/Facebook";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import classnames from "classnames";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import { Wrapper } from "../tools/Wrapper";

class Facebook extends EditorComponent {
  static get componentId() {
    return "Facebook";
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  getAppData() {
    return {
      appId: 113869198637480,
      href: "{{ brizy_dc_current_page_unique_url }}",
      lang: "{{ brizy_dc_page_language }}"
    };
  }

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
      pageTabs,
      height,
      smallHeader,
      hideCover,
      showFacepile,
      facebookGroupHref,
      skin,
      showSocialContext,
      showMetaData,
      width
    } = v;

    const className = classnames(
      "brz-fb",
      `brz-fb-${facebookType === "button" ? "like" : facebookType}`,
      { "brz-fb-styles": facebookType !== "button" },
      { "brz-fb-styles-button": facebookType === "button" },
      _className,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
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
        width: "500",
        href:
          facebookPageHref === ""
            ? "https://facebook.com/brizy.io"
            : facebookPageHref,
        tabs: pageTabs,
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
            ? "https://www.facebook.com/groups/brizy/"
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
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper {...this.makeWrapperProps({ className })}>
            <FacebookPlugin
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
      pageTabs,
      height,
      smallHeader,
      hideCover,
      showFacepile,
      width,
      facebookGroupHref,
      showSocialContext,
      showMetaData,
      skin
    } = v;

    const className = classnames(
      "brz-fb",
      `brz-fb-${facebookType === "button" ? "like" : facebookType}`,
      { "brz-fb-styles": facebookType !== "button" },
      { "brz-fb-styles-button": facebookType === "button" },
      _className,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
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
        "data-width": "500",
        "data-tabs": pageTabs,
        "data-height": height,
        "data-small-header": smallHeader === "on",
        "data-hide-cover": hideCover === "on",
        "data-adapt-container-width": true,
        "data-show-facepile": showFacepile === "on",
        "data-href":
          facebookPageHref === ""
            ? "https://facebook.com/brizy.io"
            : facebookPageHref,
        "data-lang": appData.lang
      },
      group: {
        "data-width": width,
        "data-href":
          facebookGroupHref === ""
            ? "https://www.facebook.com/groups/brizy/"
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
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={className}>
          <FacebookPlugin
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
