import { ProgressBar1 } from "@brizy/component/src/Flex/ProgressBar1";
import { ProgressBar2 } from "@brizy/component/src/Flex/ProgressBar2";
import classnames from "classnames";
import React, { ReactNode } from "react";
import BoxResizer from "visual/component/BoxResizer";
import { Text } from "visual/component/ContentOptions/types";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import { getBoxResizerParams } from "visual/editorComponents/ProgressBar/utils";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { attachRefs } from "visual/utils/react";
import { Wrapper } from "../tools/Wrapper";
import { BaseProgressBar } from "./Base";
import * as sidebarConfig from "./sidebar";
import { styleBar, styleBg } from "./styles";
import * as toolbarConfig from "./toolbar";
import { ProgressStyle, Value } from "./types";

export default class ProgressBar extends BaseProgressBar {
  handleChange = (patch: Partial<Value>): void => this.patchValue(patch);

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const {
      className,
      customCSS,
      showText,
      percentage,
      showPercentage,
      progressBarStyle
    } = v;
    const { meta } = this.props;

    const { points, restrictions } = getBoxResizerParams();

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
      <Text
        id="text"
        v={v}
        className="brz-progress-bar__text"
        onChange={this.handleChange}
      />
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            {({ ref: cssRef }) => (
              <Wrapper
                {...this.makeWrapperProps({
                  className: classNameBg,
                  attributes: {
                    ...makeDataAttr({ name: "type", value: progressBarStyle })
                  },
                  ref: (el) => {
                    attachRefs(el, [toolbarRef, cssRef]);
                  }
                })}
              >
                <BoxResizer
                  points={points}
                  restrictions={restrictions}
                  meta={meta}
                  value={v}
                  onChange={this.handleChange}
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
                </BoxResizer>
              </Wrapper>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }
}
