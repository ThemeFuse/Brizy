import classnames from "classnames";
import React, { ReactNode } from "react";
import ResizeAware from "react-resize-aware";
import CustomCSS from "visual/component/CustomCSS";
import { ElementModel } from "visual/component/Elements/Types";
import Toolbar from "visual/component/Toolbar";
import TwitterPlugin from "visual/component/Twitter";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { deviceModeSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { css } from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { DESKTOP, ResponsiveMode } from "visual/utils/responsiveMode";
import { encodeToString } from "visual/utils/string";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

export interface Value extends ElementModel {
  twitterType: "embed" | "followButton" | "mentionButton";
  twitterUsername: string;
  twitterTheme: string;
  buttonLarge: string;
  buttonShowCount: string;
  buttonShowScreenName: string;
  customCSS: string;
  height: number;
  mobileHeight: number;
  tabletHeight: number;
}

class Twitter extends EditorComponent<Value> {
  static get componentId(): "Twitter" {
    return "Twitter";
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  dvv = (key: string): string => {
    const v = this.getValue();
    const device = deviceModeSelector(getStore().getState());

    return defaultValueValue({ v, key, device });
  };

  isUnMounted = false;

  currentDeviceMode: ResponsiveMode = DESKTOP;

  componentWillUnmount(): void {
    this.isUnMounted = true;
  }

  handleChange = (): void => {
    const state = getStore().getState();
    const deviceMode = deviceModeSelector(state);

    if (!this.isUnMounted && this.currentDeviceMode !== deviceMode) {
      this.forceUpdate();

      this.currentDeviceMode = deviceMode;
    }
  };

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const {
      twitterType,
      twitterUsername,
      twitterTheme,
      buttonLarge,
      buttonShowCount,
      buttonShowScreenName,
      customCSS
    } = v;
    const name = twitterUsername.trim() || "NatGeo";

    const height = this.dvv("height");

    const className = classnames(
      "brz-twitter",
      { "brz-twitter__embed": twitterType === "embed" },
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );

    const data = {
      embed: {
        sourceType: "profile",
        screenName: name,
        theme: twitterTheme,
        url: `https://twitter.com/${name}`,
        options: { height: `${height}` }
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
            <ResizeAware onResize={this.handleChange} />
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForView(v: Value, vd: Value, vs: Value): ReactNode {
    const {
      twitterType,
      twitterUsername,
      twitterTheme,
      buttonLarge,
      buttonShowCount,
      buttonShowScreenName,
      tweet,
      customCSS,
      height,
      tabletHeight,
      mobileHeight
    } = v;
    const name = twitterUsername.trim() || "NatGeo";

    const className = classnames(
      "brz-twitter",
      `brz-twitter__${twitterType}`,
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );

    const data = {
      embed: {
        "data-height": `${height}`,
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

    const attributes = {
      "data-type": twitterType,
      "data-heights": encodeToString({
        desktop: height,
        tablet: tabletHeight ?? height,
        mobile: mobileHeight ?? height
      })
    };

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <Wrapper
          {...this.makeWrapperProps({ className })}
          attributes={attributes}
        >
          <TwitterPlugin data={data[twitterType]} />
        </Wrapper>
      </CustomCSS>
    );
  }
}

export default Twitter;
