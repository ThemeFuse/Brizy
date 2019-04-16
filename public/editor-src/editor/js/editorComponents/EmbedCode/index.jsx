import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import BoxResizer from "visual/component/BoxResizer";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import { styleClassName, styleCSSVars } from "./styles";
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

  mounted = false;

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleResizerChange = patch => this.patchValue(patch);

  handleToolbarClose = () => {
    if (!this.mounted) {
      return;
    }

    this.patchValue({
      tabsState: "tabNormal",
      tabsCurrentElement: "tabCurrentElement",
      tabsColor: "tabBorder"
    });
  };

  renderForEdit(v) {
    const { code } = v;
    const content = !code ? (
      <Placeholder icon="iframe" />
    ) : (
      <div
        className={classnames({ "brz-blocked": IS_EDITOR })}
        dangerouslySetInnerHTML={{ __html: code }}
      />
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig(toolbarConfig)}
        onClose={this.handleToolbarClose}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div className={styleClassName(v)} style={styleCSSVars(v)}>
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
