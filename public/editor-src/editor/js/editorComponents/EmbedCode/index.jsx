import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import BoxResizer from "visual/component/BoxResizer";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";

const resizerPoints = ["centerLeft", "centerRight"];
const resizerRestrictions = {
  width: {
    min: 5,
    max: 100
  },
  tabletWidth: {
    min: 5,
    max: 100
  },
  mobileWidth: {
    min: 5,
    max: 100
  }
};

class EmbedCode extends EditorComponent {
  static get componentId() {
    return "EmbedCode";
  }

  static defaultValue = defaultValue;

  handleResizerChange = patch => this.patchValue(patch);

  renderForEdit(v, vs, vd) {
    const { code } = v;

    const className = classnames(
      "brz-embed-code",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );

    const content = !code ? (
      <Placeholder icon="iframe" />
    ) : (
      <div
        className={classnames({ "brz-blocked": IS_EDITOR })}
        dangerouslySetInnerHTML={{ __html: code }}
      />
    );

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div className={className}>
            <BoxResizer
              points={resizerPoints}
              restrictions={resizerRestrictions}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
            >
              <div className="brz-embed-content">{content}</div>
            </BoxResizer>
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default EmbedCode;
