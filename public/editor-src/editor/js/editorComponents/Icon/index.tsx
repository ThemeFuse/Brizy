import classnames from "classnames";
import React, { Fragment, ReactNode } from "react";
import { omit } from "timm";
import { isEditor } from "visual/providers/RenderProvider";
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
import { isStory } from "visual/global/EditorModeContext";
import { blocksDataSelector, deviceModeSelector } from "visual/redux/selectors";
import { Block } from "visual/types";
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

const classNameContainer = "brz-icon__container";

class Icon extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId(): "Icon" {
    return "Icon";
  }

  patchValue(patch: PatchValue, meta = {}) {
    const link = handleLinkChange(patch);
    super.patchValue({ ...patch, ...link }, meta);
  }

  handleResizerChange = (patch: Patch): void => {
    const device = this.getDeviceMode();
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
          const globalBlocks = blocksDataSelector(this.getReduxState());
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
          ...(isEditor(this.renderContext) && {
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
    const config = this.getGlobalConfig();
    const linkData = getLinkData(v, config);

    const classNameIcon = classnames(
      "brz-icon",
      "brz-span",
      { "brz-blocked": v.tabsState === "hover" },
      customClassName,
      this.css(
        `${this.getComponentId()}-icon`,
        `${this.getId()}-icon`,
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
    );

    const classWrapper = classnames(classNameContainer, {
      "brz-popup2__action-close":
        linkData.type === "action" && actionClosePopup === "on"
    });

    const classWrapperStory = classnames(
      classNameContainer,
      this.css(
        `${this.getComponentId()}-icon-wrap`,
        `${this.getId()}-icon-wrap`,
        styleWrapper({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
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
    const store = this.getReduxStore();
    const options = makeOptionValueToAnimation({ v, store });
    const { cloneableAnimationId } = this.props.meta;
    const animationId = Str.read(cloneableAnimationId) ?? this.getId();
    const isHidden = isStory(this.props.editorMode) || hoverName === "none";
    return (
      <Fragment>
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        >
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            <Wrapper
              {...this.makeWrapperProps({
                className: isStory(this.props.editorMode)
                  ? classWrapperStory
                  : classWrapper,
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
        {shouldRenderPopup(v, blocksDataSelector(this.getReduxState())) &&
          this.renderPopups()}
      </Fragment>
    );
  }
}

export default Icon;
