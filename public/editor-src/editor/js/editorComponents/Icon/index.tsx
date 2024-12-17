import classnames from "classnames";
import React, { Fragment, ReactNode } from "react";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import { HoverAnimation } from "visual/component/HoverAnimation/HoverAnimation";
import { getHoverAnimationOptions } from "visual/component/HoverAnimation/utils";
import Link from "visual/component/Link";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import Config from "visual/global/Config";
import { blocksDataSelector, deviceModeSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { Block } from "visual/types";
import { css } from "visual/utils/cssStyle";
import { isStory } from "visual/utils/models";
import { getCSSId } from "visual/utils/models/cssId";
import { getLinkData } from "visual/utils/models/link";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { makeOptionValueToAnimation } from "visual/utils/options/utils/makeValueToOptions";
import { handleLinkChange } from "visual/utils/patch/Link";
import * as Str from "visual/utils/reader/string";
import * as State from "visual/utils/stateMode";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style, styleWrapper } from "./styles";
import * as toolbarConfig from "./toolbar";
import { Patch, PatchValue, Props, Value } from "./types";
import {
  resizerPoints,
  resizerTransformPatch,
  resizerTransformValue
} from "./utils";
import { omit } from "timm";

const config = Config.getAll();
const IS_STORY = isStory(config);
const classNameContainer = "brz-icon__container";

class Icon extends EditorComponent<Value, Props> {
  static get componentId(): "Icon" {
    return "Icon";
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  patchValue(patch: PatchValue, meta = {}) {
    const link = handleLinkChange(patch);
    super.patchValue({ ...patch, ...link }, meta);
  }

  handleResizerChange = (patch: Patch): void => {
    const device = deviceModeSelector(getStore().getState());
    const sizeKey = defaultValueKey({ key: "size", device, state: "normal" });

    this.patchValue({
      ...resizerTransformPatch(patch),
      [sizeKey]: "custom"
    });
  };

  renderPopups(): ReactNode {
    const meta = this.props.meta;
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: (itemData: Block) => {
        let {
          value: { popupId }
        } = itemData;

        const { blockId } = itemData;

        let newMeta = omit(meta, ["globalBlockId"]);

        if (itemData.type === "GlobalBlock" && itemData.value._id) {
          // TODO: some kind of error handling
          const globalBlocks = blocksDataSelector(getStore().getState());
          const globalBlockId = itemData.value._id;
          const blockData = globalBlocks[globalBlockId];

          popupId = blockData.value.popupId;
          newMeta = {
            ...newMeta,
            globalBlockId
          };
        }

        return {
          blockId,
          meta: newMeta,
          ...(IS_EDITOR && {
            instanceKey: `${this.getId()}_${popupId}`
          })
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
      filename,
      customCSS,
      cssClass
    } = v;
    const linkData = getLinkData(v);

    const classNameIcon = classnames(
      "brz-icon",
      "brz-span",
      { "brz-blocked": v.tabsState === "hover" },
      customClassName,
      css(
        `${this.getComponentId()}-icon`,
        `${this.getId()}-icon`,
        style(v, vs, vd)
      )
    );

    const classWrapper = classnames(classNameContainer, {
      "brz-popup2__action-close":
        linkData.type === "action" && actionClosePopup === "on"
    });

    const classWrapperStory = classnames(
      classNameContainer,
      css(
        `${this.getComponentId()}-icon-wrap`,
        `${this.getId()}-icon-wrap`,
        styleWrapper(v, vs, vd)
      )
    );

    let content = (
      <span className={classNameIcon}>
        <ThemeIcon name={name} type={type} filename={filename} />
      </span>
    );

    if (linkData.href) {
      content = (
        <Link
          type={linkData.type}
          href={linkData.href}
          target={linkData.target}
          rel={linkData.rel}
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
          {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        >
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            <Wrapper
              {...this.makeWrapperProps({
                className: IS_STORY ? classWrapperStory : classWrapper,
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
                  withoutWrapper={true}
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
