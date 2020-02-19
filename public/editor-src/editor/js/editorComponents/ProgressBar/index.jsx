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

  renderForEdit(v, vs, vd) {
    const {
      className,
      percentage,
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
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div className={classNameBg}>
            <BoxResizer
              points={resizerPoints}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
            >
              {progressBarStyle === "style2" && showPercentage === "on" && (
                <span
                  className="brz-span brz-progress-bar__percent"
                  style={{
                    marginLeft: `${percentage - 2}%`
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
                >
                  <div className="for-bar">
                    {showText === "on" && this.renderText(v)}
                    {progressBarStyle === "style1" &&
                      showPercentage === "on" && (
                        <span className="brz-span brz-progress-bar__percent">
                          {percentage}%
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </BoxResizer>
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }
}
