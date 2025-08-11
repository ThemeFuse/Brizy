import { ProgressBar1 } from "@brizy/component/src/Flex/ProgressBar1";
import { ProgressBar2 } from "@brizy/component/src/Flex/ProgressBar2";
import classnames from "classnames";
import React, { ReactNode } from "react";
import { Text } from "visual/component/ContentOptions/types";
import CustomCSS from "visual/component/CustomCSS";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { Wrapper } from "../tools/Wrapper";
import { BaseProgressBar } from "./Base";
import { styleBar, styleBg } from "./styles";
import { ProgressStyle, Value } from "./types";

export default class ProgressBar extends BaseProgressBar {
  renderForView(v: Value, vs: Value, vd: Value): ReactNode {
    const {
      className,
      customCSS,
      showText,
      percentage,
      showPercentage,
      progressBarStyle
    } = v;

    const _showPercentage = showPercentage === "on";

    const classNameBar = classnames(
      this.css(
        `${this.getComponentId()}-bar`,
        `${this.getId()}-bar`,
        styleBar({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const classNameBg = classnames(
      className,
      "brz-progress-bar",
      `brz-progress-bar-${progressBarStyle}`,
      {
        "brz-without-percent": showPercentage === "off",
        "brz-without-text": progressBarStyle === "style1" && showText === "off"
      },
      this.css(
        `${this.getComponentId()}-bg`,
        `${this.getId()}-bg`,
        styleBg({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const progressBarText = (
      <Text id="text" v={v} className="brz-progress-bar__text" />
    );

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <Wrapper
          {...this.makeWrapperProps({
            className: classNameBg,
            attributes: {
              ...makeDataAttr({ name: "type", value: progressBarStyle })
            }
          })}
        >
          {progressBarStyle === ProgressStyle.Style1 ? (
            <ProgressBar1
              text={progressBarText}
              className={classNameBar}
              showText={showText === "on"}
              showPercentage={_showPercentage}
              percentage={percentage}
            />
          ) : (
            <ProgressBar2
              className={classNameBar}
              showPercentage={_showPercentage}
              percentage={percentage}
            />
          )}
        </Wrapper>
      </CustomCSS>
    );
  }
}
