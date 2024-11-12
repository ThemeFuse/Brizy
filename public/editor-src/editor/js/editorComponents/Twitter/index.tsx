import { TwitterEmbedEditor, TwitterEmbedPreview } from "@brizy/component";
import { TwitterFollowEditor, TwitterFollowPreview } from "@brizy/component";
import { TwitterMentionEditor, TwitterMentionPreview } from "@brizy/component";
import classnames from "classnames";
import React, { ReactNode } from "react";
import ResizeAware from "react-resize-aware";
import CustomCSS from "visual/component/CustomCSS";
import { ElementModel } from "visual/component/Elements/Types";
import Toolbar from "visual/component/Toolbar";
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
import { Model } from "../EditorComponent/types";
import { Patch } from "visual/utils/patch/types";
import { Meta } from "../ToolbarItemType";

export interface Value extends ElementModel {
  twitterType: "embed" | "followButton" | "mentionButton";
  twitterUsername: string;
  twitterTheme: string;
  buttonLarge: string;
  buttonShowCount: string;
  buttonShowScreenName: string;
  customCSS: string;
  height: number;
  tweet: string;
  mobileHeight: number;
  tabletHeight: number;
}

type Theme = "light" | "dark";
type ButtonSize = "small" | "large";

interface TwitterOptions {
  type: "embed" | "followButton" | "mentionButton";
  name: string;
  height: number;
  theme: Theme;
  buttonSize: ButtonSize;
  buttonShowCount: boolean;
  buttonShowScreenName: boolean;
}

interface PreviewTwitterOptions extends TwitterOptions {
  tweet: string;
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

  patchValue(patch: Partial<Model<Value>>, meta: Meta): void {
    const type = this.handleTypeChange(patch);
    super.patchValue({ ...patch, ...type }, meta);
  }

  handleTypeChange(patch: Partial<Model<Value>>): Patch {
    const twitter = patch.twitter;

    if (!twitter) return {};

    const isEmbed = this.dvv("twitterType") === "embed";

    if (twitter === "button" && isEmbed) {
      return { twitterType: "followButton" };
    }

    return {};
  }

  renderEditorByType(props: TwitterOptions) {
    const {
      type,
      name,
      height,
      theme,
      buttonSize,
      buttonShowCount,
      buttonShowScreenName
    } = props;

    const _name = name.replace(/^@/, "");

    switch (type) {
      case "embed":
        return (
          <TwitterEmbedEditor name={_name} height={height} theme={theme} />
        );
      case "followButton":
        return (
          <TwitterFollowEditor
            name={_name}
            size={buttonSize}
            showCount={buttonShowCount}
            showScreenName={buttonShowScreenName}
          />
        );
      case "mentionButton":
        return <TwitterMentionEditor name={_name} size={buttonSize} />;
    }
  }

  renderPreviewByType(props: PreviewTwitterOptions) {
    const {
      type,
      name,
      height,
      theme,
      buttonSize,
      buttonShowCount,
      buttonShowScreenName,
      tweet
    } = props;

    const _name = name.replace(/^@/, "");

    switch (type) {
      case "embed":
        return (
          <TwitterEmbedPreview name={_name} height={height} theme={theme} />
        );
      case "followButton":
        return (
          <TwitterFollowPreview
            name={_name}
            size={buttonSize}
            showCount={buttonShowCount}
            showScreenName={buttonShowScreenName}
          />
        );
      case "mentionButton":
        return (
          <TwitterMentionPreview name={_name} size={buttonSize} tweet={tweet} />
        );
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const { twitterType, customCSS, twitter } = v;

    const twitterEmbedType = "embed";
    const twitterFollowButtonType = "followButton";

    let type: typeof twitterType;

    if (twitter === twitterEmbedType) {
      type = twitterEmbedType;
    } else {
      type =
        twitterType !== twitterEmbedType
          ? twitterType
          : twitterFollowButtonType;
    }

    const className = classnames(
      "brz-twitter",
      { "brz-twitter__embed": twitter === "embed" },
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );

    const props: TwitterOptions = {
      name: v.twitterUsername.trim(),
      type,
      height: Number(this.dvv("height")),
      theme: v.twitterTheme === "dark" ? "dark" : "light",
      buttonSize: v.buttonLarge === "large" ? "large" : "small",
      buttonShowCount: v.buttonShowCount === "on",
      buttonShowScreenName: v.buttonShowScreenName === "on"
    };

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={customCSS}>
          <Wrapper {...this.makeWrapperProps({ className })}>
            {this.renderEditorByType(props)}
            <ResizeAware onResize={this.handleChange} />
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForView(v: Value, vd: Value, vs: Value): ReactNode {
    const {
      twitterType,
      customCSS,
      height,
      tabletHeight,
      mobileHeight,
      twitter
    } = v;

    const twitterEmbedType = "embed";
    const twitterFollowButtonType = "followButton";

    let type: typeof twitterType;

    if (twitter === twitterEmbedType) {
      type = twitterEmbedType;
    } else {
      type =
        twitterType !== twitterEmbedType
          ? twitterType
          : twitterFollowButtonType;
    }

    const className = classnames(
      "brz-twitter",
      `brz-twitter__${type}`,
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );

    const props: PreviewTwitterOptions = {
      name: v.twitterUsername.trim(),
      type,
      height: Number(this.dvv("height")),
      theme: v.twitterTheme === "dark" ? "dark" : "light",
      buttonSize: v.buttonLarge === "large" ? "large" : "small",
      buttonShowCount: v.buttonShowCount === "on",
      buttonShowScreenName: v.buttonShowScreenName === "on",
      tweet: v.tweet
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
          {this.renderPreviewByType(props)}
        </Wrapper>
      </CustomCSS>
    );
  }
}

export default Twitter;
