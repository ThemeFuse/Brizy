import classnames from "classnames";
import React, { Fragment, ReactNode, createRef } from "react";
import { omit } from "timm";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import { HoverAnimation } from "visual/component/HoverAnimation/HoverAnimation";
import { getHoverAnimationOptions } from "visual/component/HoverAnimation/utils";
import Link from "visual/component/Link";
import Toolbar from "visual/component/Toolbar";
import { Tooltip } from "visual/component/Tooltip";
import { TooltipImperativeProps } from "visual/component/Tooltip/types";
import {
  getToolbarPlacement,
  getTooltipPlacement,
  shouldUpdateTooltipByPatch
} from "visual/component/Tooltip/utils";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent, {
  Props as PrevProps
} from "visual/editorComponents/EditorComponent";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isStory } from "visual/providers/EditorModeProvider";
import { isEditor } from "visual/providers/RenderProvider";
import { blocksDataSelector, deviceModeSelector } from "visual/redux/selectors";
import { Block } from "visual/types/Block";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { getCSSId } from "visual/utils/models/cssId";
import { getLinkData } from "visual/utils/models/link";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { makeOptionValueToAnimation } from "visual/utils/options/utils/makeValueToOptions";
import { handleLinkChange } from "visual/utils/patch/Link";
import { attachRefs } from "visual/utils/react";
import * as Str from "visual/utils/reader/string";
import * as State from "visual/utils/stateMode";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";
import * as tooltipSidebarConfig from "../tools/Tooltip/tooltipSidebar";
import * as tooltipToolbarConfig from "../tools/Tooltip/tooltipToolbar";
import { Icon as _Icon } from "./Controls/Icon";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style, styleTooltip, styleWrapper } from "./styles";
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

  tooltipRef = createRef<TooltipImperativeProps>();
  tooltipReferenceElement: Element | null = null;
  isInitialisedTooltip = false;

  static get componentId(): ElementTypes.Icon {
    return ElementTypes.Icon;
  }

  componentDidUpdate(prevProps: PrevProps<Value, Props>) {
    const { enableTooltip } = this.props.dbValue;
    const { enableTooltip: prevEnableTooltip } = prevProps.dbValue;

    if (enableTooltip === "on" && prevEnableTooltip !== enableTooltip) {
      this.tooltipRef.current?.openTooltip();
    }
  }

  patchValue(patch: PatchValue, meta = {}) {
    const link = handleLinkChange(patch);

    const needToUpdateTooltip = shouldUpdateTooltipByPatch(patch);

    if (needToUpdateTooltip) {
      this.tooltipRef.current?.updatePopper();
    }

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

          if (blockData) {
            popupId = blockData.value.popupId;
          }

          newMeta = {
            ...newMeta,
            globalBlockId
          };
        }

        return {
          blockId,
          meta: newMeta,
          ...(isEditor(this.props.renderContext) && {
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

  renderTooltip(v: Value, vs: Value, vd: Value) {
    const {
      tooltipOffset,
      tooltipText,
      tooltipTriggerClick,
      tooltipPlacement
    } = v;

    const classTooltip = this.css(
      `${this.getComponentId()}-tooltip`,
      `${this.getId()}-tooltip`,
      styleTooltip({
        v,
        vs,
        vd,
        store: this.getReduxStore(),
        contexts: this.getContexts()
      })
    );
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(
          tooltipToolbarConfig,
          tooltipSidebarConfig,
          {
            allowExtend: false
          }
        )}
      >
        {({ ref: tooltipToolbarRef }) => (
          <Tooltip
            overlay={tooltipText}
            offset={tooltipOffset}
            ref={this.tooltipRef}
            openOnClick={tooltipTriggerClick === "on"}
            placement={tooltipPlacement}
            id={this.getId()}
            contentRef={tooltipToolbarRef}
            referenceElement={this.tooltipReferenceElement}
            className={classTooltip}
          />
        )}
      </Toolbar>
    );
  }

  handleToggleTooltip = () => {
    this.tooltipRef.current?.toggleTooltip();
  };

  handleUpdateTooltipReference(el: Element | null) {
    const { enableTooltip } = this.getValue();

    if (enableTooltip !== "on") {
      return;
    }

    if (!this.isInitialisedTooltip) {
      this.isInitialisedTooltip = true;
      // We call forceUpdate because updating the ref alone doesn't trigger a re-render,
      // so Popper doesn't get the updated reference element.
      this.forceUpdate();
    }

    if (el) {
      this.tooltipReferenceElement = el;
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const {
      type,
      name,
      actionClosePopup,
      customClassName,
      filename,
      customCSS,
      cssClass,
      ariaLabel,
      enableTooltip,
      tooltipPlacement
    } = v;
    const config = this.getGlobalConfig();
    const linkData = getLinkData(v, config);
    const isTooltipEnabled = enableTooltip === "on";

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
          contexts: this.getContexts()
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
          contexts: this.getContexts()
        })
      )
    );

    const iconAttrs = isTooltipEnabled
      ? makeDataAttr({
          name: "tooltip-wrapper-id",
          value: this.getId()
        })
      : {};

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

    const _tooltipPlacement = isTooltipEnabled
      ? getTooltipPlacement(tooltipPlacement)
      : undefined;

    const mainToolbarPlacement = getToolbarPlacement(_tooltipPlacement);

    return (
      <Fragment>
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
          placement={mainToolbarPlacement}
        >
          {({ ref: toolbarRef }) => (
            <CustomCSS selectorName={this.getId()} css={customCSS}>
              {({ ref: cssRef }) => (
                <Wrapper
                  {...this.makeWrapperProps({
                    className: isStory(this.props.editorMode)
                      ? classWrapperStory
                      : classWrapper,
                    attributes: props,
                    ref: (el) => {
                      attachRefs(el, [toolbarRef, cssRef]);
                      this.handleUpdateTooltipReference(el);
                    }
                  })}
                  onClick={this.handleToggleTooltip}
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
                      {linkData.href ? (
                        <Link {...linkData}>
                          <_Icon
                            type={type}
                            classNameIcon={classNameIcon}
                            name={name}
                            filename={filename}
                            attr={iconAttrs}
                          />
                        </Link>
                      ) : (
                        <_Icon
                          type={type}
                          classNameIcon={classNameIcon}
                          name={name}
                          filename={filename}
                          ariaLabel={ariaLabel}
                          attr={iconAttrs}
                        />
                      )}
                    </HoverAnimation>
                  </BoxResizer>
                </Wrapper>
              )}
            </CustomCSS>
          )}
        </Toolbar>
        {shouldRenderPopup(v, blocksDataSelector(this.getReduxState())) &&
          this.renderPopups()}
        {isTooltipEnabled && this.renderTooltip(v, vs, vd)}
      </Fragment>
    );
  }
}

export default Icon;
