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

const URL = "https://www.google.com/maps/embed/v1/place";
const KEY = "AIzaSyCcywKcxXeMZiMwLDcLgyEnNglcLOyB_qw";

const resizerPoints = [
  "topLeft",
  "topCenter",
  "topRight",
  "centerLeft",
  "centerRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight"
];
const resizerRestrictions = {
  height: {
    min: 25,
    max: Infinity
  },
  width: {
    min: 5,
    max: 100
  },
  tabletHeight: {
    min: 25,
    max: Infinity
  },
  tabletWidth: {
    min: 5,
    max: 100
  },
  mobileHeight: {
    min: 25,
    max: Infinity
  },
  mobileWidth: {
    min: 5,
    max: 100
  }
};
const resizerTransformValue = v => {
  const { size, tabletSize, mobileSize, ...rest } = v;

  return {
    width: size,
    tabletWidth: tabletSize,
    mobileWidth: mobileSize,
    ...rest
  };
};
const resizerTransformPatch = patch => {
  if (patch.width) {
    patch.size = patch.width;
    delete patch.width;
  }

  if (patch.tabletWidth) {
    patch.tabletSize = patch.tabletWidth;
    delete patch.tabletWidth;
  }

  if (patch.mobileWidth) {
    patch.mobileSize = patch.mobileWidth;
    delete patch.mobileWidth;
  }

  return patch;
};

class Map extends EditorComponent {
  static get componentId() {
    return "Map";
  }

  static defaultValue = defaultValue;

  mounted = false;

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

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

  handleResizerChange = patch => this.patchValue(resizerTransformPatch(patch));

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.boxShadowColorPalette && `${_v.boxShadowColorPalette}__boxShadow`,
      _v.borderColorPalette && `${_v.borderColorPalette}__border`,
      _v.hoverBorderColorPalette &&
        `${_v.hoverBorderColorPalette}__hoverBorder`,

      _v.tabletBorderColorPalette &&
        `${_v.tabletBorderColorPalette}__tabletBorder`,

      _v.mobileBorderColorPalette &&
        `${_v.mobileBorderColorPalette}__mobileBorder`
    ]);

    const { address, zoom } = v;
    const src = `${URL}?key=${KEY}&q=${address}&zoom=${zoom}`;

    const content = !address ? (
      <Placeholder icon="pin" />
    ) : (
      <div className="brz-map-content">
        <iframe
          className={classnames("brz-iframe", { "brz-blocked": IS_EDITOR })}
          src={src}
        />
      </div>
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
              value={resizerTransformValue(v)}
              onChange={this.handleResizerChange}
            >
              {content}
            </BoxResizer>
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default Map;
