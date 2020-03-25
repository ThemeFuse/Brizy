import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import classnames from "classnames";
import TextEditor from "visual/editorComponents/Text/Editor";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import { css } from "visual/utils/cssStyle";
import { styleBg, styleBar } from "./styles";
import defaultValue from "./defaultValue.json";
import BoxResizer from "visual/component/BoxResizer";

const resizerPoints = ["centerLeft", "centerRight"];

export default class ProgressBar extends EditorComponent {
  static get componentId() {
    return "ProgressBar";
  }

  static defaultValue = defaultValue;

  handleTextChange = text => {
    this.patchValue({ text });
  };

  handleResizerChange = patch => this.patchValue(patch);

  renderText({ text }) {
    return <TextEditor value={text} onChange={this.handleTextChange} />;
  }

  renderStyle1(v, vs, vd) {
    const { percentage, showText, showPercentage } = v;
    const classNameBar = classnames(
      "brz-d-xs-flex",
      "brz-justify-content-xs-between",
      "brz-align-items-xs-center",
      "brz-progress-bar__wrapper",
      css(
        `${this.constructor.componentId}-bar`,
        `${this.getId()}-bar`,
        styleBar(v, vs, vd)
      )
    );

    return (
      <div
        className={classNameBar}
        data-progress={percentage}
        style={{
          width: `${percentage}%`,
          maxWidth: `${percentage}%`
        }}
      >
        {showText === "on" && this.renderText(v)}
        {showPercentage === "on" && (
          <span className="brz-span brz-progress-bar__percent">
            {percentage}%
          </span>
        )}
      </div>
    );
  }

  renderStyle2(v, vs, vd) {
    const { percentage, showPercentage } = v;
    const classNameBar = classnames(
      "brz-d-xs-flex",
      "brz-justify-content-xs-between",
      "brz-align-items-xs-center",
      "brz-progress-bar__wrapper",
      css(
        `${this.constructor.componentId}-bar`,
        `${this.getId()}-bar`,
        styleBar(v, vs, vd)
      )
    );

    return (
      <>
        {showPercentage === "on" && (
          <span
            className="brz-span brz-progress-bar__percent"
            style={{
              marginLeft: `${
                percentage >= 94 ? percentage - 7 : percentage - 1
              }%`
            }}
          >
            {percentage}%
          </span>
        )}
        <div className="brz-progress-bar-overlay">
          <div
            className={classNameBar}
            data-progress={percentage}
            style={{
              width: `${percentage}%`,
              maxWidth: `${percentage}%`
            }}
          />
        </div>
      </>
    );
  }

  renderForEdit(v, vs, vd) {
    const {
      className,
      customCSS,
      showText,
      showPercentage,
      progressBarStyle
    } = v;
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

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={customCSS}>
          <div className={classNameBg} data-type={progressBarStyle}>
            <BoxResizer
              points={resizerPoints}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
            >
              {progressBarStyle === "style1"
                ? this.renderStyle1(v, vs, vd)
                : this.renderStyle2(v, vs, vd)}
            </BoxResizer>
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }
}
