import { TwitterEmbedPreview } from "@brizy/component/src/Flex/TwitterEmbed";
import { TwitterFollowPreview } from "@brizy/component/src/Flex/TwitterFollowButton";
import { TwitterMentionPreview } from "@brizy/component/src/Flex/TwitterMentionButton";
import classnames from "classnames";
import React, { ReactNode } from "react";
import CustomCSS from "visual/component/CustomCSS";
import { encodeToString } from "visual/utils/string";
import { Wrapper } from "../tools/Wrapper";
import { BaseTwitter } from "./Base";
import { style } from "./styles";
import { PreviewTwitterOptions, Value } from "./types";

class Twitter extends BaseTwitter {
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
