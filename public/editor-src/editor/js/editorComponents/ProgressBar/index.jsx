import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import TextEditor from "visual/editorComponents/Text/Editor";
import Toolbar from "visual/component-new/Toolbar";
import * as toolbarConfig from "./toolbar";
import {
  containerStyleClassName,
  containerStyleCSSVars,
  styleClassName,
  styleCSSVars
} from "./styles";
import defaultValue from "./defaultValue.json";
import BoxResizer from "visual/component-new/BoxResizer";

const resizerPoints = ["centerLeft", "centerRight"];

class ProgressBar extends EditorComponent {
  static get componentId() {
    return "ProgressBar";
  }

  static defaultValue = defaultValue;

  handleTextChange = text => {
    this.patchValue({ text });
  };

  handleResizerChange = patch => this.patchValue(patch);

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.colorPalette && `${_v.colorPalette}__color`,
      _v.bgColorPalette && `${_v.bgColorPalette}__bg`,
      _v.bg2ColorPalette && `${_v.bg2ColorPalette}__bg2`,
      _v.fontStyle && `${_v.fontStyle}__fsDesktop`,
      _v.mobileFontStyle && `${_v.mobileFontStyle}__fsMobile`
    ]);

    const { text, percentage, showPercentage } = v;

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
        <div
          className={containerStyleClassName(v)}
          style={containerStyleCSSVars(v)}
        >
          <BoxResizer
            points={resizerPoints}
            meta={this.props.meta}
            value={v}
            onChange={this.handleResizerChange}
          >
            <div
              className={styleClassName(v)}
              style={styleCSSVars(v)}
              data-progress={percentage}
            >
              <TextEditor value={text} onChange={this.handleTextChange} />
              {showPercentage === "on" && (
                <span className="brz-span brz-progress-bar__percent">
                  {percentage}%
                </span>
              )}
            </div>
          </BoxResizer>
        </div>
      </Toolbar>
    );
  }
}

export default ProgressBar;
