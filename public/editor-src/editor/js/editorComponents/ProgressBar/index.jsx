import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import TextEditor from "visual/editorComponents/Text/Editor";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import {
  containerStyleClassName,
  containerStyleCSSVars,
  styleClassName,
  styleCSSVars
} from "./styles";
import defaultValue from "./defaultValue.json";
import BoxResizer from "visual/component/BoxResizer";

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
      _v.fontStyle && `${_v.fontStyle}__fsDesktop`,
      _v.tabletFontStyle && `${_v.tabletFontStyle}__fsTablet`,
      _v.mobileFontStyle && `${_v.mobileFontStyle}__fsMobile`
    ]);

    const { text, percentage, showPercentage } = v;

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
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
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default ProgressBar;
