import React, { ReactNode } from "react";
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
import { ElementModel } from "visual/component/Elements/Types";

export interface Value extends ElementModel {
  address: string;
  zoom: number;
  coverImageSrc: string;
}

interface Patch {
  [k: string]: string;
}

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

const resizerTransformValue = (v: Value): ElementModel => {
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
const resizerTransformPatch = (patch: Patch): Patch => {
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

class Map extends EditorComponent<Value> {
  static get componentId(): "Map" {
    return "Map";
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  handleResizerChange = (patch: Patch): void =>
    this.patchValue(resizerTransformPatch(patch));

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const { address, zoom, coverImageSrc } = v;
    const wrapperClassName = classnames(
      "brz-map",
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );
    // intrinsic-ignore - this class is needed for WP theme twentytwenty(themes/twentytwenty/assets/js/index.js?ver=1.1)
    // intrinsicRatioVideos - property contain function - makeFit which changes iframes width
    // and breaks our code(video, map inside megamenu isn't showing as example)
    const iframeClassName = classnames("brz-iframe", "intrinsic-ignore", {
      "brz-blocked": IS_EDITOR
    });
    const iframeSrc = `${URL}?key=${KEY}&q=${address}&zoom=${zoom}`;
    const resizerRestrictions = {
      height: {
        px: { min: 25, max: Infinity },
        "%": { min: 5, max: Infinity }
      },
      width: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      },
      tabletHeight: {
        px: { min: 25, max: Infinity },
        "%": { min: 5, max: Infinity }
      },
      tabletWidth: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      },
      mobileHeight: {
        px: { min: 25, max: Infinity },
        "%": { min: 5, max: Infinity }
      },
      mobileWidth: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      }
    };

    const isCovered = Boolean(coverImageSrc);

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper
            {...this.makeWrapperProps({
              className: wrapperClassName,
              attributes: {
                "data-cover": `${isCovered}`,
                "data-src": iframeSrc
              }
            })}
          >
            <BoxResizer
              points={resizerPoints}
              restrictions={resizerRestrictions}
              meta={this.props.meta}
              value={resizerTransformValue(v)}
              onChange={this.handleResizerChange}
            >
              <div className="brz-map-content">
                {isCovered ? (
                  <div className="brz-map__cover" />
                ) : (
                  <iframe className={iframeClassName} src={iframeSrc} />
                )}
              </div>
            </BoxResizer>
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default Map;
