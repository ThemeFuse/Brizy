import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Toolbar from "visual/component/Toolbar";
import TwitterPlugin from "visual/component/Twitter";
import { css } from "visual/utils/cssStyle";
import CustomCSS from "visual/component/CustomCSS";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import defaultValue from "./defaultValue.json";
import { Wrapper } from "../tools/Wrapper";

class Twitter extends EditorComponent {
  static get componentId() {
    return "Twitter";
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  renderForEdit(v, vs, vd) {
    const {
      twitterType,
      twitterUsername,
      twitterTheme,
      buttonLarge,
      buttonShowCount,
      buttonShowScreenName,
      customCSS
    } = v;
    const name = twitterUsername.trim() || "ThemeFuse";
    const className = classnames(
      "brz-twitter",
      { "brz-customSize": twitterType === "embed" },
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );
    const data = {
      embed: {
        sourceType: "profile",
        screenName: name,
        theme: twitterTheme,
        url: `https://twitter.com/${name}`,
        options: { height: "100%" }
      },
      followButton: {
        screenName: name,
        url: `https://twitter.com/${name}`,
        options: {
          size: buttonLarge === "large" ? "large" : "small",
          showCount: buttonShowCount === "on",
          showScreenName: buttonShowScreenName === "on"
        }
      },
      mentionButton: {
        screenName: name,
        url: `https://twitter.com/${name}`,
        options: {
          size: buttonLarge === "large" ? "large" : "small"
        }
      }
    };

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={customCSS}>
          <Wrapper {...this.makeWrapperProps({ className })}>
            <TwitterPlugin type={twitterType} data={data[twitterType]} />
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForView(v, vd, vs) {
    const {
      twitterType,
      twitterUsername,
      twitterTheme,
      buttonLarge,
      buttonShowCount,
      buttonShowScreenName,
      tweet,
      customCSS
    } = v;
    const name = twitterUsername.trim() || "ThemeFuse";
    const className = classnames(
      "brz-twitter",
      { "brz-customSize": twitterType === "embed" },
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );
    const data = {
      embed: {
        "data-height": "100%",
        className: "twitter-timeline",
        "data-theme": twitterTheme,
        href: `https://twitter.com/${name}`
      },
      followButton: {
        className: "twitter-follow-button",
        "data-related": name,
        href: `https://twitter.com/${name}`,
        "data-show-screen-name": buttonShowScreenName === "on",
        "data-size": buttonLarge === "large" ? "large" : "small",
        "data-show-count": buttonShowCount === "on"
      },
      mentionButton: {
        className: "twitter-mention-button",
        href: `https://twitter.com/${name}?screen_name=${name}`,
        "data-text": tweet,
        "data-size": buttonLarge === "large" ? "large" : "small"
      }
    };

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <div className={className}>
          <TwitterPlugin data={data[twitterType]} />
        </div>
      </CustomCSS>
    );
  }
}

export default Twitter;
