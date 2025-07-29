import { TwitterEmbedEditor } from "@brizy/component/src/Flex/TwitterEmbed";
import { TwitterFollowEditor } from "@brizy/component/src/Flex/TwitterFollowButton";
import { TwitterMentionEditor } from "@brizy/component/src/Flex/TwitterMentionButton";
import classnames from "classnames";
import React, { ReactNode } from "react";
import ResizeAware from "react-resize-aware";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import { BaseTwitter } from "visual/editorComponents/Twitter/Base";
import { Patch } from "visual/utils/patch/types";
import { attachRefs } from "visual/utils/react";
import { Model } from "../EditorComponent/types";
import { Meta } from "../ToolbarItemType";
import { Wrapper } from "../tools/Wrapper";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import { TwitterOptions, Value } from "./types";

class Twitter extends BaseTwitter {
  componentWillUnmount(): void {
    this.isUnMounted = true;
  }

  handleChange = (): void => {
    const deviceMode = this.getDeviceMode();

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
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            {({ ref: cssRef }) => (
              <Wrapper
                {...this.makeWrapperProps({
                  className,
                  ref: (el) => attachRefs(el, [cssRef, toolbarRef])
                })}
              >
                {this.renderEditorByType(props)}
                <ResizeAware onResize={this.handleChange} />
              </Wrapper>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }
}

export default Twitter;
