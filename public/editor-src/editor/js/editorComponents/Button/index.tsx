import classnames from "classnames";
import React, {
  type ReactElement,
  type ReactNode,
  type RefObject,
  createRef
} from "react";
import { omit } from "timm";
import BoxResizer from "visual/component/BoxResizer";
import type { Patch } from "visual/component/BoxResizer/types";
import { Text } from "visual/component/ContentOptions/types";
import CustomCSS from "visual/component/CustomCSS";
import { HoverAnimation } from "visual/component/HoverAnimation/HoverAnimation";
import { getHoverAnimationOptions } from "visual/component/HoverAnimation/utils";
import Link from "visual/component/Link";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import { Tooltip } from "visual/component/Tooltip";
import type { TooltipImperativeProps } from "visual/component/Tooltip/types";
import {
  getToolbarPlacement,
  getTooltipPlacement,
  shouldUpdateTooltipByPatch
} from "visual/component/Tooltip/utils";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent, {
  type Props as PrevProps
} from "visual/editorComponents/EditorComponent";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isStory } from "visual/providers/EditorModeProvider";
import { isEditor } from "visual/providers/RenderProvider";
import { blocksDataSelector } from "visual/redux/selectors";
import type { Block } from "visual/types/Block";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { getCSSId } from "visual/utils/models/cssId";
import { getLinkData } from "visual/utils/models/link";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { makeOptionValueToAnimation } from "visual/utils/options/utils/makeValueToOptions";
import { handleLinkChange } from "visual/utils/patch/Link";
import { attachRefs } from "visual/utils/react";
import { DESKTOP } from "visual/utils/responsiveMode";
import * as State from "visual/utils/stateMode";
import { camelCase } from "visual/utils/string";
import * as Str from "visual/utils/string/specs";
import type { Literal } from "visual/utils/types/Literal";
import type { MValue } from "visual/utils/value";
import * as tooltipSidebarConfig from "../tools/Tooltip/tooltipSidebar";
import * as tooltipToolbarConfig from "../tools/Tooltip/tooltipToolbar";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import {
  style,
  styleButtonFillAnimation,
  styleIcon,
  styleTooltip
} from "./styles";
import * as toolbarConfig from "./toolbar";
import type { PatchValue, Props, Value } from "./types";
import { getHoverClassName, hasSizing, isButtonFillHover } from "./utils";

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

const restrictions = {
  width: {
    "%": { min: 10, max: 100 }
  },
  height: {
    "%": { min: 5, max: Infinity }
  }
};

export default class Button extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  tooltipRef = createRef<TooltipImperativeProps>();
  tooltipReferenceElement: Element | null = null;
  isInitialisedTooltip = false;

  static get componentId(): ElementTypes.Button {
    return ElementTypes.Button;
  }

  componentDidUpdate(prevProps: PrevProps<Value, Props>) {
    const { enableTooltip } = this.props.dbValue;
    const { enableTooltip: prevEnableTooltip } = prevProps.dbValue;

    if (enableTooltip === "on" && prevEnableTooltip !== enableTooltip) {
      this.tooltipRef.current?.openTooltip();
    }
  }

  handleButtonChange(patch: PatchValue): PatchValue {
    const { updateWidthPrefixBySizeChange } = this.props;

    const linkPatch = handleLinkChange(patch);

    const extra = {};

    if (
      updateWidthPrefixBySizeChange === "%" ||
      updateWidthPrefixBySizeChange === "px"
    ) {
      const device = this.getDeviceMode();
      const dvk = (key: string) =>
        defaultValueKey({ key, device, state: "normal" });

      const sizeKey = dvk("size");
      const size = patch[sizeKey];

      if (size && size !== "custom") {
        const prefix = device === DESKTOP ? "" : device;

        Object.assign(extra, {
          [camelCase([prefix, "paddingRLSuffix"])]:
            updateWidthPrefixBySizeChange
        });
      }
    }

    return {
      ...linkPatch,
      ...extra
    };
  }

  patchValue(patch: PatchValue, meta = {}): void {
    const button = this.handleButtonChange(patch);

    const needToUpdateTooltip = shouldUpdateTooltipByPatch(patch);

    if (needToUpdateTooltip) {
      this.tooltipRef.current?.updatePopper();
    }

    super.patchValue({ ...patch, ...button }, meta);
  }

  handleResizerChange = (patch: Patch): void => this.patchValue(patch);

  handleTextChange = (patch: { [k: string]: string }): void =>
    this.patchValue(patch);

  renderIcon(v: Value, vs: Value, vd: Value): ReactNode {
    const { iconName, iconType, iconFilename } = v;

    const iconClassName = classnames(
      this.css(
        `${this.getComponentId()}-icon`,
        `${this.getId()}-icon`,
        styleIcon({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    return (
      <ThemeIcon
        className={iconClassName}
        name={iconName}
        type={iconType}
        filename={iconFilename}
      />
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

  renderSubmit(
    v: Value,
    vs: Value,
    vd: Value,
    content: ReactElement,
    refs: (RefObject<HTMLDivElement> | null)[]
  ): ReactElement {
    const { cssClass, customClassName, tabsState, type, enableTooltip } = v;
    const device = this.getDeviceMode();
    const state = State.mRead(tabsState);
    const id = getCSSId<Value>(v);
    const populationClassName = Str.mRead(cssClass || customClassName);

    const isTooltipEnabled = enableTooltip === "on";

    const className = classnames(
      "brz-btn",
      { "brz-blocked": v.tabsState === "hover" },
      "brz-btn-submit",
      populationClassName,
      this.css(
        `${this.getComponentId()}-bg`,
        `${this.getId()}-bg`,
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          device,
          hasSizing: hasSizing(v, device, state),
          contexts: this.getContexts()
        })
      )
    );

    const componentType = isEditor(this.props.renderContext) ? "a" : "button";

    return (
      <Wrapper
        {...this.makeWrapperProps({
          className,
          ref: (el) => {
            attachRefs(el, refs);
            this.handleUpdateTooltipReference(el);
          }
        })}
        component={componentType}
        attributes={{
          ...this.props.attributes,
          ...(id && { id }),
          ...(isTooltipEnabled
            ? makeDataAttr({
                name: "tooltip-wrapper-id",
                value: this.getId()
              })
            : {})
        }}
      >
        {hasSizing(v, device, state) && type !== "submit" ? (
          <BoxResizer
            points={resizerPoints}
            value={v}
            onChange={this.handleResizerChange}
            restrictions={restrictions}
          >
            {content}
          </BoxResizer>
        ) : (
          content
        )}
      </Wrapper>
    );
  }

  renderLink(
    v: Value,
    vs: Value,
    vd: Value,
    content: ReactNode,
    refs: (RefObject<HTMLDivElement> | null)[]
  ): ReactElement {
    const {
      actionClosePopup,
      customClassName,
      cssClass,
      tabsState,
      enableTooltip
    } = v;
    const config = this.getGlobalConfig();

    const state = State.mRead(tabsState);
    const device = this.getDeviceMode();
    const linkData = getLinkData<Value>(v, config);
    const id = getCSSId<Value>(v);
    const _className = Str.mRead(cssClass || customClassName);
    const hoverName = Str.read(this.dvv("hoverName")) ?? "none";
    const isTooltipEnabled = enableTooltip === "on";

    const className = classnames(
      "brz-btn",
      getHoverClassName(hoverName),
      this.css(
        this.getComponentId(),
        this.getId(),
        styleButtonFillAnimation({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      ),
      { "brz-blocked": v.tabsState === "hover" },
      _className,
      this.css(
        `${this.getComponentId()}-bg`,
        `${this.getId()}-bg`,
        style({
          v,
          vs,
          vd,
          device,
          store: this.getReduxStore(),
          hasSizing: hasSizing(v, device, state),
          contexts: this.getContexts()
        })
      ),
      {
        "brz-popup2__action-close":
          linkData.type === "action" && actionClosePopup === "on"
      }
    );

    const props: Record<string, unknown> = {
      type: linkData.type,
      href: linkData.href,
      target: linkData.target,
      rel: linkData.rel,
      className: className,
      ...(id && { id }),
      ...(isTooltipEnabled
        ? {
            attr: {
              ...makeDataAttr({
                name: "tooltip-wrapper-id",
                value: this.getId()
              })
            }
          }
        : {})
    };

    if (isEditor(this.props.renderContext)) {
      props.onDragStart = (e: Event) => {
        e.preventDefault();
        return false;
      };
      props.draggable = "false";
    }

    const wrapperProps = this.makeWrapperProps({
      attributes: props,
      slide: linkData.slide,
      ref: (el) => {
        attachRefs(el, refs);
        this.handleUpdateTooltipReference(el);
      }
    });

    if (wrapperProps.attr && wrapperProps.attributes) {
      wrapperProps.attributes = {
        ...wrapperProps.attributes,
        // The attr prop is needed for the Link component to attach the custom attributes
        attr: {
          ...(wrapperProps.attributes.attr || {}),
          ...wrapperProps.attr
        }
      };
    }

    return (
      <Wrapper
        {...wrapperProps}
        component={Link}
        onClick={this.handleToggleTooltip}
      >
        {hasSizing(v, device, state) ? (
          <BoxResizer
            points={resizerPoints}
            value={v}
            onChange={this.handleResizerChange}
            restrictions={restrictions}
          >
            {content}
          </BoxResizer>
        ) : (
          content
        )}
      </Wrapper>
    );
  }

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

        if (itemData.type === "GlobalBlock") {
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

        const _isEditor = isEditor(this.props.renderContext);
        return {
          blockId,
          meta: newMeta,
          ...(_isEditor && {
            instanceKey: `${this.getId()}_${popupId}`
          })
        };
      }
    });

    // @ts-expect-error: Need transform EditorArrayComponents to ts
    return <EditorArrayComponent {...popupsProps} />;
  }

  dvv = (key: string): MValue<Literal> => {
    const v = this.getValue();
    const device = this.getDeviceMode();
    const state = State.mRead(v.tabsState);

    return defaultValueValue({ v, key, device, state });
  };

  getHoverData(v: Value) {
    const hoverName = Str.read(this.dvv("hoverName")) ?? "none";
    const store = this.getReduxStore();
    const options = makeOptionValueToAnimation({ v, store });
    const { cloneableAnimationId } = this.props.meta;
    const animationId = Str.read(cloneableAnimationId) ?? this.getId();

    return {
      hoverName,
      options: getHoverAnimationOptions(options, hoverName),
      animationId,
      isHidden:
        isStory(this.props.editorMode) ||
        hoverName === "none" ||
        isButtonFillHover(hoverName)
    };
  }

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

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const {
      type,
      iconName,
      iconType,
      customCSS,
      tabsState,
      enableTooltip,
      tooltipPlacement
    } = v;

    const state = State.mRead(tabsState);
    const device = this.getDeviceMode();

    const isTooltipEnabled = enableTooltip === "on";
    const _isEditor = isEditor(this.props.renderContext);
    const renderIcon = iconName && iconType;

    const content =
      hasSizing(v, device, state) && _isEditor && type !== "submit" ? (
        <div className="brz-btn--story-container">
          {renderIcon && this.renderIcon(v, vs, vd)}
          <Text
            id="text"
            v={v}
            onChange={this.handleTextChange}
            allowLineBreak={true}
          />
        </div>
      ) : (
        <>
          {renderIcon && this.renderIcon(v, vs, vd)}
          <Text
            id="text"
            v={v}
            onChange={this.handleTextChange}
            allowLineBreak={true}
          />
        </>
      );

    const { hoverName, isHidden, animationId, options } = this.getHoverData(v);

    const _tooltipPlacement = isTooltipEnabled
      ? getTooltipPlacement(tooltipPlacement)
      : undefined;

    const mainToolbarPlacement = getToolbarPlacement(_tooltipPlacement);

    return (
      <>
        <HoverAnimation
          animationId={animationId}
          cssKeyframe={hoverName}
          options={options}
          isHidden={isHidden}
          withoutWrapper={true}
        >
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
            placement={mainToolbarPlacement}
          >
            {({ ref: toolbarRef }) => (
              <CustomCSS selectorName={this.getId()} css={customCSS}>
                {({ ref: cssRef }) => {
                  const refs = [toolbarRef, cssRef];

                  return type === "link"
                    ? this.renderLink(v, vs, vd, content, refs)
                    : this.renderSubmit(v, vs, vd, content, refs);
                }}
              </CustomCSS>
            )}
          </Toolbar>
        </HoverAnimation>
        {shouldRenderPopup(v, blocksDataSelector(this.getReduxState())) &&
          this.renderPopups()}
        {isTooltipEnabled && this.renderTooltip(v, vs, vd)}
      </>
    );
  }
}
