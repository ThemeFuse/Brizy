import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import BoxResizer from "visual/component/BoxResizer";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import { Wrapper } from "../tools/Wrapper";

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

const resizerTransformValue = v => {
  const {
    size,
    tabletSize,
    mobileSize,
    sizeSuffix,
    tabletSizeSuffix,
    mobileSizeSuffix,
    ...rest
  } = v;

  return {
    width: size,
    tabletWidth: tabletSize,
    mobileWidth: mobileSize,
    widthSuffix: sizeSuffix,
    tabletWidthSuffix: tabletSizeSuffix,
    mobileWidthSuffix: mobileSizeSuffix,
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

  static experimentalDynamicContent = true;

  handleResizerChange = patch => this.patchValue(resizerTransformPatch(patch));

  renderForEdit(v, vs, vd) {
    const { address, zoom } = v;
    const wrapperClassName = classnames(
      "brz-map",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );
    const iframeClassName = classnames("brz-iframe", {
      "brz-blocked": IS_EDITOR
    });
    const iframeSrc = `${URL}?key=${KEY}&q=${address}&zoom=${zoom}`;
    const resizerRestrictions = {
      height: {
        px: {
          min: 25,
          max: Infinity
        },
        "%": {
          min: 5,
          max: Infinity
        }
      },
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
      tabletHeight: {
        px: {
          min: 25,
          max: Infinity
        },
        "%": {
          min: 5,
          max: Infinity
        }
      },
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
      mobileHeight: {
        px: {
          min: 25,
          max: Infinity
        },
        "%": {
          min: 5,
          max: Infinity
        }
      },
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

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper {...this.makeWrapperProps({ className: wrapperClassName })}>
            <BoxResizer
              points={resizerPoints}
              restrictions={resizerRestrictions}
              meta={this.props.meta}
              value={resizerTransformValue(v)}
              onChange={this.handleResizerChange}
            >
              <div className="brz-map-content">
                <iframe className={iframeClassName} src={iframeSrc} />
              </div>
            </BoxResizer>
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default Map;
