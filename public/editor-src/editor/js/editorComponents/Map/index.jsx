import React from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import BoxResizer from "visual/component-new/BoxResizer";
import Placeholder from "visual/component-new/Placeholder";
import Toolbar from "visual/component-new/Toolbar";
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
  const { size, mobileSize, ...rest } = v;

  return {
    width: size,
    mobileWidth: mobileSize,
    ...rest
  };
};
const resizerTransformPatch = patch => {
  if (patch.width) {
    patch.size = patch.width;
    delete patch.width;
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

  handleResizerChange = patch => this.patchValue(resizerTransformPatch(patch));

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.boxShadowColorPalette && `${_v.boxShadowColorPalette}__boxShadow`
    ]);

    const { address, zoom } = v;
    const src = `${URL}?key=${KEY}&q=${address}&zoom=${zoom}`;

    const content = !address ? (
      <Placeholder icon="pin" />
    ) : (
      <iframe
        className={classnames("brz-iframe", { "brz-blocked": IS_EDITOR })}
        src={src}
      />
    );

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
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
      </Toolbar>
    );
  }
}

export default Map;
