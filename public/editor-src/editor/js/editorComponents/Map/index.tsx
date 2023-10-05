import classnames from "classnames";
import { MapEditor, MapPreview } from "@brizy/component";
import React, { ReactNode } from "react";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import { ElementModel } from "visual/component/Elements/Types";
import { HoverAnimation } from "visual/component/HoverAnimation/HoverAnimation";
import { getHoverAnimationOptions } from "visual/component/HoverAnimation/utils";
import { makeOptionValueToAnimation } from "visual/component/Options/types/utils/makeValueToOptions";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Config from "visual/global/Config";
import { css } from "visual/utils/cssStyle";
import { IS_WP } from "visual/utils/env";
import { isStory } from "visual/utils/models";
import { read as readBoolean } from "visual/utils/reader/bool";
import { read as readString } from "visual/utils/string/specs";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

export interface Value extends ElementModel {
  address: string;
  zoom: number;
}

interface Patch {
  [k: string]: string;
}

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
    const IS_STORY = isStory(Config.getAll());
    const { address, zoom, hoverName } = v;
    const wrapperClassName = classnames(
      "brz-map",
      {
        "brz-map_styles": IS_STORY
      },
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );

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

    const _hoverName = readString(hoverName) ?? "none";
    const options = makeOptionValueToAnimation(v);
    const { wrapperAnimationId } = this.props.meta;
    const animationId = readString(wrapperAnimationId) ?? this.getId();
    const { wrapperAnimationActive } = this.props.meta;
    const isDisabledHover = readBoolean(wrapperAnimationActive);
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper
            {...this.makeWrapperProps({
              className: wrapperClassName
            })}
          >
            <BoxResizer
              points={resizerPoints}
              restrictions={resizerRestrictions}
              meta={this.props.meta}
              value={resizerTransformValue(v)}
              onChange={this.handleResizerChange}
            >
              <HoverAnimation
                animationId={animationId}
                cssKeyframe={_hoverName}
                options={getHoverAnimationOptions(options, _hoverName)}
                isDisabledHover={isDisabledHover}
                isHidden={IS_STORY}
              >
                <MapEditor
                  address={address}
                  zoom={zoom}
                  platform={IS_WP ? "WP" : "CLOUD"}
                />
              </HoverAnimation>
            </BoxResizer>
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForView(v: Value, vs: Value, vd: Value): ReactNode {
    const { address, zoom, hoverName } = v;

    const IS_STORY = isStory(Config.getAll());
    const _hoverName = readString(hoverName) ?? "none";
    const hoverIsHidden = _hoverName === "none" || IS_STORY;

    const wrapperClassName = classnames(
      "brz-map",
      {
        "brz-map_styles": hoverIsHidden
      },
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );

    const options = makeOptionValueToAnimation(v);
    const { wrapperAnimationId } = this.props.meta;
    const animationId = readString(wrapperAnimationId) ?? this.getId();

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <Wrapper
          {...this.makeWrapperProps({
            className: wrapperClassName
          })}
        >
          <HoverAnimation
            animationId={animationId}
            cssKeyframe={_hoverName}
            options={getHoverAnimationOptions(options, _hoverName)}
            isHidden={hoverIsHidden}
          >
            <MapPreview
              address={address}
              zoom={zoom}
              platform={IS_WP ? "WP" : "CLOUD"}
            />
          </HoverAnimation>
        </Wrapper>
      </CustomCSS>
    );
  }
}

export default Map;
