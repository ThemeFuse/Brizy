import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import classnames from "classnames";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import TwitterPlugin from "visual/component/Twitter";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import CustomCSS from "visual/component/CustomCSS";

import defaultValue from "./defaultValue.json";

class Twitter extends EditorComponent {
  static get componentId() {
    return "Twitter";
  }

  static defaultValue = defaultValue;

  renderForEdit(v, vs, vd) {
    const {
      twitterType,
      twitterUsername,
      twitterTheme,
      buttonLarge,
      buttonShowCount,
      buttonShowScreenName
    } = v;

    const name =
      twitterUsername.trim() === "" ? "ThemeFuse" : twitterUsername.trim();

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
          size: buttonLarge === "on" ? "large" : "small",
          showCount: buttonShowCount === "on",
          showScreenName: buttonShowScreenName === "on"
        }
      },
      mentionButton: {
        screenName: name,
        url: `https://twitter.com/${name}`,
        options: {
          size: buttonLarge === "on" ? "large" : "small"
        }
      }
    };

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div className={className}>
            <TwitterPlugin type={twitterType} data={data[twitterType]} />
          </div>
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
      tweet
    } = v;

    const name =
      twitterUsername.trim() === "" ? "ThemeFuse" : twitterUsername.trim();

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
        class: "twitter-timeline",
        "data-theme": twitterTheme,
        href: `https://twitter.com/${name}`
      },
      followButton: {
        class: "twitter-follow-button",
        "data-related": name,
        href: `https://twitter.com/${name}`,
        "data-show-screen-name": buttonShowScreenName === "on",
        "data-size": buttonLarge === "on" ? "large" : "small",
        "data-show-count": buttonShowCount === "on"
      },
      mentionButton: {
        class: "twitter-mention-button",
        href: `https://twitter.com/${name}?screen_name=${name}`,
        "data-text": tweet,
        "data-size": buttonLarge === "on" ? "large" : "small"
      }
    };
    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={className}>
          <TwitterPlugin data={data[twitterType]} />
        </div>
      </CustomCSS>
    );
  }
}

export default Twitter;
