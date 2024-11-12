import React from "react";
import BoxResizer from "visual/component/BoxResizer";
import {
  AlphaMapEditor,
  AlphaMapPreview
} from "visual/component/BrizyBuilder/Map";
import CustomCSS from "visual/component/CustomCSS";
import { HoverAnimation } from "visual/component/HoverAnimation/HoverAnimation";
import { getHoverAnimationOptions } from "visual/component/HoverAnimation/utils";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Config, { isWp } from "visual/global/Config";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { deviceModeSelector } from "visual/redux/selectors";
import { isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import { makeOptionValueToAnimation } from "visual/utils/options/utils/makeValueToOptions";
import { read as readBoolean } from "visual/utils/reader/bool";
import * as State from "visual/utils/stateMode";
import { read as readString } from "visual/utils/string/specs";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";
import { Value, Patch } from "./type";
import {
  getBoxResizerParams,
  resizerTransformPatch,
  resizerTransformValue
} from "./utils";

class Map extends EditorComponent<Value> {
  static get componentId(): ElementTypes.Map {
    return ElementTypes.Map;
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  isStory = isStory(Config.getAll());
  isWp = isWp(Config.getAll());

  handleResizerChange = (patch: Patch): void =>
    this.patchValue(resizerTransformPatch(patch));

  dvv = (key: string): MValue<Literal> => {
    const v = this.getValue();
    const device = deviceModeSelector(this.getReduxState());
    const state = State.mRead(v.tabsState);

    return defaultValueValue({ v, key, device, state });
  };

  getHoverData = (v: Value) => {
    const { wrapperAnimationId, wrapperAnimationActive = "false" } =
      this.props.meta;
    const hoverName = readString(this.dvv("hoverName")) ?? "none";
    const options = makeOptionValueToAnimation(v);
    const animationId = readString(wrapperAnimationId) ?? this.getId();
    const isDisabledHover = readBoolean(wrapperAnimationActive);

    return {
      animationId,
      hoverName,
      options: getHoverAnimationOptions(options, hoverName),
      isDisabledHover,
      isHidden: hoverName === "none"
    };
  };

  renderForEdit(v: Value): JSX.Element {
    const { address, zoom, customCSS } = v;

    const { animationId, hoverName, options, isDisabledHover, isHidden } =
      this.getHoverData(v);
    const { points, restrictions } = getBoxResizerParams();

    const wrapperClassName = this.getCSSClassnames({
      toolbars: [toolbarConfig],
      sidebars: [sidebarConfig],
      extraClassNames: ["brz-map", { "brz-map_styles": isHidden }]
    });

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={customCSS}>
          <Wrapper
            {...this.makeWrapperProps({
              className: wrapperClassName
            })}
          >
            <HoverAnimation
              animationId={animationId}
              cssKeyframe={hoverName}
              options={options}
              isDisabledHover={isDisabledHover}
              isHidden={isHidden || this.isStory}
              withoutWrapper={true}
            >
              <BoxResizer
                points={points}
                restrictions={restrictions}
                meta={this.props.meta}
                value={resizerTransformValue(v)}
                onChange={this.handleResizerChange}
              >
                <AlphaMapEditor
                  address={address}
                  zoom={zoom}
                  className={this.isWp ? "intrinsic-ignore" : ""}
                />
              </BoxResizer>
            </HoverAnimation>
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForView(v: Value): JSX.Element {
    const { address, zoom, customCSS } = v;
    const { animationId, options, isHidden, hoverName } = this.getHoverData(v);

    const wrapperClassName = this.getCSSClassnames({
      toolbars: [toolbarConfig],
      sidebars: [sidebarConfig],
      extraClassNames: ["brz-map", { "brz-map_styles": isHidden }]
    });

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <Wrapper
          {...this.makeWrapperProps({
            className: wrapperClassName
          })}
        >
          <HoverAnimation
            animationId={animationId}
            cssKeyframe={hoverName}
            options={options}
            isHidden={isHidden || this.isStory}
            withoutWrapper={true}
          >
            <AlphaMapPreview
              address={address}
              zoom={zoom}
              className={this.isWp ? "intrinsic-ignore" : ""}
            />
          </HoverAnimation>
        </Wrapper>
      </CustomCSS>
    );
  }
}

export default Map;
