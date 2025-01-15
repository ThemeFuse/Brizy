import { ProgressBar1, ProgressBar2 } from "@brizy/component";
import classnames from "classnames";
import React, { ReactNode } from "react";
import BoxResizer from "visual/component/BoxResizer";
import { Text } from "visual/component/ContentOptions/types";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { getBoxResizerParams } from "visual/editorComponents/ProgressBar/utils";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { styleBar, styleBg } from "./styles";
import * as toolbarConfig from "./toolbar";
import { ProgressStyle, Value } from "./types";

export default class ProgressBar extends EditorComponent<Value> {
  static get componentId(): ElementTypes.ProgressBar {
    return ElementTypes.ProgressBar;
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

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
          renderContext: this.renderContext
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
          renderContext: this.renderContext
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
        <CustomCSS selectorName={this.getId()} css={customCSS}>
          <Wrapper
            {...this.makeWrapperProps({
              className: classNameBg,
              attributes: {
                ...makeDataAttr({ name: "type", value: progressBarStyle })
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
        </CustomCSS>
      </Toolbar>
    );
  }

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
          renderContext: this.renderContext
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
          renderContext: this.renderContext
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
