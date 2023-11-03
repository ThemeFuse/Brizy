import { ProgressBar1, ProgressBar2 } from "@brizy/component";
import classnames from "classnames";
import React from "react";
import BoxResizer from "visual/component/BoxResizer";
import { Text } from "visual/component/ContentOptions/types";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { css } from "visual/utils/cssStyle";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { styleBar, styleBg } from "./styles";
import * as toolbarConfig from "./toolbar";

const resizerPoints = ["centerLeft", "centerRight"];
const resizerRestrictions = {
  width: {
    px: {
      min: 5,
      max: 1000
    },
    "%": {
      min: 5,
      max: 100
    }
  },
  // Tablet
  tabletWidth: {
    px: {
      min: 5,
      max: 1000
    },
    "%": {
      min: 5,
      max: 100
    }
  },
  // Mobile
  mobileWidth: {
    px: {
      min: 5,
      max: 1000
    },
    "%": {
      min: 5,
      max: 100
    }
  }
};

export default class ProgressBar extends EditorComponent {
  static get componentId() {
    return "ProgressBar";
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  handleChange = (patch) => this.patchValue(patch);

  renderForEdit(v, vs, vd) {
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
      css(
        `${this.constructor.componentId}-bar`,
        `${this.getId()}-bar`,
        styleBar(v, vs, vd)
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
      css(
        `${this.constructor.componentId}-bg`,
        `${this.getId()}-bg`,
        styleBg(v, vs, vd)
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
              points={resizerPoints}
              restrictions={resizerRestrictions}
              meta={this.props.meta}
              value={v}
              onChange={this.handleChange}
            >
              {progressBarStyle === "style1" ? (
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

  renderForView(v, vs, vd) {
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
      css(
        `${this.constructor.componentId}-bar`,
        `${this.getId()}-bar`,
        styleBar(v, vs, vd)
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
      css(
        `${this.constructor.componentId}-bg`,
        `${this.getId()}-bg`,
        styleBg(v, vs, vd)
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
          {progressBarStyle === "style1" ? (
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
