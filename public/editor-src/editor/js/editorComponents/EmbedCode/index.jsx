import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import BoxResizer from "visual/component-new/BoxResizer";
import Placeholder from "visual/component-new/Placeholder";
import Toolbar from "visual/component-new/Toolbar";
import * as toolbarConfig from "./toolbar";
import { styleClassName, styleCSSVars } from "./styles";
import defaultValue from "./defaultValue.json";

const resizerPoints = ["centerLeft", "centerRight"];
const resizerRestrictions = {
  width: {
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

  renderForEdit(v) {
    const { code } = v;
    const content = !code ? (
      <Placeholder icon="nc-iframe" containerWidth={this.props.meta.desktopW} />
    ) : (
      <div
        className={classnames({ "brz-ed-blocked": IS_EDITOR })}
        dangerouslySetInnerHTML={{ __html: code }}
      />
    );

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
        <div className={styleClassName(v)} style={styleCSSVars(v)}>
          <BoxResizer
            points={resizerPoints}
            restrictions={resizerRestrictions}
            meta={this.props.meta}
            value={v}
            onChange={this.handleResizerChange}
          >
            {content}
          </BoxResizer>
        </div>
      </Toolbar>
    );
  }
}

export default EmbedCode;
