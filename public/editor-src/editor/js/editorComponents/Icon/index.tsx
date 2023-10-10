import classnames from "classnames";
import React, { Fragment, ReactNode } from "react";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import { ElementModel } from "visual/component/Elements/Types";
import { HoverAnimation } from "visual/component/HoverAnimation/HoverAnimation";
import { getHoverAnimationOptions } from "visual/component/HoverAnimation/utils";
import Link from "visual/component/Link";
import { Target } from "visual/component/Link/types/Target";
import { Type } from "visual/component/Link/types/Type";
import { makeOptionValueToAnimation } from "visual/component/Options/types/utils/makeValueToOptions";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent, {
  ComponentsMeta
} from "visual/editorComponents/EditorComponent";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import Config from "visual/global/Config";
import { blocksDataSelector, deviceModeSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { Block } from "visual/types";
import { css } from "visual/utils/cssStyle";
import { isStory } from "visual/utils/models";
import { CssId, getCSSId } from "visual/utils/models/cssId";
import { getLinkData } from "visual/utils/models/link";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { WithClassName } from "visual/utils/options/attributes";
import * as State from "visual/utils/stateMode";
import * as Str from "visual/utils/string/specs";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style, styleWrapper } from "./styles";
import * as toolbarConfig from "./toolbar";

const resizerPoints = ["topLeft", "topRight", "bottomLeft", "bottomRight"];

export interface Value extends ElementModel, CssId {
  name: string;
  type: string;

  linkPage: string;
  popups: Block[];
  linkPopup: string;
  linkLightBox: string;
  linkExternal: string;
  linkExternalBlank: Target;
  linkExternalRel: string;
  linkPopulation: string;
  linkAnchor: string;
  linkUpload: string;
  linkExternalType: "linkExternal" | "linkPopulation";
  linkType: Type;
  customClassName: string;
  customID: string;
  linkToSlide: number;

  customSize: number;
  tabletCustomSize: number;
  mobileCustomSize: number;

  customSizeSuffix: string;
  tabletCustomSizeSuffix: string;
  mobileCustomSizeSuffix: string;

  hrefs: {
    anchor: string;
    external: string;
    popup: string;
    upload: string;
  };
}

interface Props extends WithClassName {
  meta: ComponentsMeta;
  attributes: Record<string, string | number>;
}
interface Patch {
  [k: string]: string;
}

const resizerTransformValue = (v: Value): ElementModel => {
  const {
    customSize,
    tabletCustomSize,
    mobileCustomSize,
    customSizeSuffix,
    tabletCustomSizeSuffix,
    mobileCustomSizeSuffix,
    ...rest
  } = v;

  return {
    ...rest,
    size: customSize,
    tabletSize: tabletCustomSize,
    mobileSize: mobileCustomSize,
    sizeSuffix: customSizeSuffix,
    tabletSizeSuffix: tabletCustomSizeSuffix,
    mobileSizeSuffix: mobileCustomSizeSuffix
  };
};

const resizerTransformPatch = (patch: Patch): Patch => {
  let newPatch = patch;

  if ("size" in patch) {
    const { size, ..._patch } = patch;
    newPatch = { ..._patch, customSize: size };
  }

  if ("tabletSize" in patch) {
    const { tabletSize, ..._patch } = patch;
    newPatch = { ..._patch, tabletCustomSize: tabletSize };
  }

  if ("mobileSize" in patch) {
    const { mobileSize, ..._patch } = patch;
    newPatch = { ..._patch, mobileCustomSize: mobileSize };
  }

  return newPatch;
};

const config = Config.getAll();
const IS_STORY = isStory(config);

class Icon extends EditorComponent<Value, Props> {
  static get componentId(): "Icon" {
    return "Icon";
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  handleResizerChange = (patch: Patch): void => {
    const device = deviceModeSelector(getStore().getState());
    const sizeKey = defaultValueKey({ key: "size", device, state: "normal" });

    this.patchValue({
      ...resizerTransformPatch(patch),
      [sizeKey]: "custom"
    });
  };

  renderPopups(): ReactNode {
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: (itemData: Block) => {
        let {
          value: { popupId }
        } = itemData;

        const { blockId } = itemData;

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          const globalBlocks = blocksDataSelector(getStore().getState());
          const blockData = globalBlocks[itemData.value._id];

          popupId = blockData.value.popupId;
        }

        return {
          blockId,
          instanceKey: IS_EDITOR
            ? `${this.getId()}_${popupId}`
            : itemData.type === "GlobalBlock"
            ? `global_${popupId}`
            : popupId
        };
      }
    });

    /**
     * Since the EditorArrayComponent is still in JS
     * TS cannot read properly it's return type
     * @ts-expect-error */
    return <EditorArrayComponent {...popupsProps} />;
  }

  dvv = (key: string): MValue<Literal> => {
    const v = this.getValue();
    const device = deviceModeSelector(this.getReduxState());
    const state = State.mRead(v.tabsState);

    return defaultValueValue({ v, key, device, state });
  };

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const {
      type,
      name,
      actionClosePopup,
      customClassName,
      customCSS,
      cssClass
    } = v;
    const linkData = getLinkData(v);

    const classNameIcon = classnames(
      "brz-icon",
      "brz-span",
      customClassName,
      css(
        `${this.getComponentId()}-icon`,
        `${this.getId()}-icon`,
        style(v, vs, vd)
      )
    );

    const classWrapper = classnames(
      "brz-icon__container",
      css(
        `${this.getComponentId()}-icon-wrap`,
        `${this.getId()}-icon-wrap`,
        styleWrapper(v, vs, vd)
      )
    );

    let content = (
      <span className={classNameIcon}>
        <ThemeIcon name={name} type={type} />
      </span>
    );

    if (linkData.href) {
      const className = classnames({
        "brz-popup2__action-close":
          linkData.type === "action" && actionClosePopup === "on"
      });

      content = (
        <Link
          type={linkData.type}
          href={linkData.href}
          target={linkData.target}
          rel={linkData.rel}
          className={className}
          slide={linkData.slide}
        >
          {content}
        </Link>
      );
    }
    const id = getCSSId(v);

    const props = {
      ...(id && { id }),
      className: cssClass || customClassName
    };

    const hoverName = Str.read(this.dvv("hoverName")) ?? "none";
    const options = makeOptionValueToAnimation(v);
    const { cloneableAnimationId } = this.props.meta;
    const animationId = Str.read(cloneableAnimationId) ?? this.getId();
    const isHidden = IS_STORY || hoverName === "none";
    return (
      <Fragment>
        <Toolbar
          // @ts-expect-error: Need transform to ts
          {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        >
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            <Wrapper
              {...this.makeWrapperProps({
                className: IS_STORY ? classWrapper : "brz-icon__container",
                attributes: { ...props }
              })}
            >
              <BoxResizer
                keepAspectRatio
                points={resizerPoints}
                meta={this.props.meta}
                value={resizerTransformValue(v)}
                onChange={this.handleResizerChange}
              >
                <HoverAnimation
                  animationId={animationId}
                  cssKeyframe={hoverName}
                  options={getHoverAnimationOptions(options, hoverName)}
                  isHidden={isHidden}
                >
                  {content}
                </HoverAnimation>
              </BoxResizer>
            </Wrapper>
          </CustomCSS>
        </Toolbar>
        {shouldRenderPopup(v, blocksDataSelector(getStore().getState())) &&
          this.renderPopups()}
      </Fragment>
    );
  }
}

export default Icon;
