import { Bool, Obj, Str } from "@brizy/readers";
import classnames from "classnames";
import { noop } from "es-toolkit";
import React, { Fragment, createRef } from "react";
import ResizeAware from "react-resize-aware";
import CustomCSS from "visual/component/CustomCSS";
import { HoverAnimation } from "visual/component/HoverAnimation/HoverAnimation";
import { getHoverAnimationOptions } from "visual/component/HoverAnimation/utils";
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
  Props as EditorComponentProps
} from "visual/editorComponents/EditorComponent";
import { ECKeyDCInfo } from "visual/editorComponents/EditorComponent/types";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import {
  DBMigration,
  withMigrations
} from "visual/editorComponents/tools/withMigrations";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isStory } from "visual/providers/EditorModeProvider";
import { isEditor, isView } from "visual/providers/RenderProvider";
import { blocksDataSelector } from "visual/redux/selectors";
import { DeviceMode } from "visual/types";
import { Block } from "visual/types/Block";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { isUnsplashImage } from "visual/utils/image/utils";
import { Positive, is as isPositive } from "visual/utils/math/Positive";
import { getLinkData } from "visual/utils/models/link";
import { makeOptionValueToAnimation } from "visual/utils/options/utils/makeValueToOptions";
import { DESKTOP } from "visual/utils/responsiveMode";
import { HOVER } from "visual/utils/stateMode";
import { attachRefs } from "../../utils/react";
import * as tooltipSidebarConfig from "../tools/Tooltip/tooltipSidebar";
import * as tooltipToolbarConfig from "../tools/Tooltip/tooltipToolbar";
import { Wrapper } from "../tools/Wrapper";
import ImageContent from "./Image";
import ImageWrapper from "./Wrapper";
import defaultValue from "./defaultValue.json";
import { migrations } from "./migrations";
import {
  calculateWrapperSizes,
  getContainerSize,
  getDimension,
  getExtraImageProps,
  getHoverImageUrlsFor,
  getImageUrlsFor,
  getResponsiveUrls,
  handleImageChangePatch,
  processDCValueHook,
  processDBValue,
  updateContainerDimensions,
  updateContainerWidth,
  updateHoverImageHeight,
  ImageComponentState,
  ImageUtilsContext,
  ExtendedWrapperSizes
} from "./shared";
import * as sidebarConfig from "./sidebar";
import { style, styleContent, styleHover, styleTooltip } from "./styles";
import toolbarConfigFn from "./toolbar";
import {
  GalleryRenderer,
  GetResponsiveUrls,
  ImageSizes,
  ImagesSources,
  Meta,
  Patch,
  Props,
  State,
  V as Value,
  WrapperSizes
} from "./types";
import { showOriginalImage } from "./utils";
import { isGIFExtension, isSVGExtension } from "visual/utils/image/utils";
import { omit } from "timm";

class Image extends EditorComponent<Value, Props, State> {
  static defaultProps = {
    meta: {},
    onResize: noop,
    onToolbarOpen: noop,
    onToolbarClose: noop,
    onToolbarEnter: noop,
    onToolbarLeave: noop
  };
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;
  prevWrapperSizes = {
    cW: 0,
    cH: 0
  };
  container = React.createRef<Element>();

  tooltipRef = createRef<TooltipImperativeProps>();
  tooltipReferenceElement: Element | null = null;
  isInitialisedTooltip = false;

  mounted = false;
  dbValueMigrated:
    | DBMigration<EditorComponentProps<Value, Props>>["dbValue"]
    | undefined;

  constructor(props: EditorComponentProps<Value, Props>) {
    super(props);
    const { desktopW, mobileW, tabletW } = this.props.meta;

    this.state = {
      containerWidth: desktopW,
      tabletContainerWidth: tabletW,
      mobileContainerWidth: mobileW,
      isDragging: false,
      sizePatch: null
    };
  }

  static get componentId(): ElementTypes.Image {
    return ElementTypes.Image;
  }

  /**
   * Creates the context object needed by shared utilities
   */
  private getUtilsContext(): ImageUtilsContext {
    return {
      container: this.container,
      mounted: this.mounted,
      prevWrapperSizes: this.prevWrapperSizes,
      state: this.state,
      meta: this.props.meta,
      renderContext: this.props.renderContext,
      editorContext: this.context,
      reduxState: this.getReduxState(),
      config: this.getGlobalConfig(),
      deviceMode: this.getDeviceMode(),
      getValue: () => this.getValue(),
      getValue2: () => this.getValue2(),
      setState: (updater, callback) => {
        if (typeof updater === "function") {
          this.setState(
            (prevState) => ({ ...prevState, ...updater(prevState) }),
            callback
          );
        } else {
          this.setState((prevState) => ({ ...prevState, ...updater }), callback);
        }
      },
      updatePrevWrapperSizes: (sizes) => {
        this.prevWrapperSizes = sizes;
      },
      patchValue: (patch) => {
        super.patchValue(patch as Patch);
      }
    };
  }

  componentDidMount() {
    if (isView(this.props.renderContext)) {
      return;
    }

    this.mounted = true;

    this.handleResize();
  }

  componentDidUpdate(prevProps: EditorComponentProps<Value, Props>) {
    const device = this.getDeviceMode();
    const {
      sizeType: prevSizeType,
      heightSuffix: prevSuffix,
      enableTooltip: prevEnableTooltip
    } = prevProps.dbValue;

    const {
      sizeType: currentSizeType,
      heightSuffix: currentSuffix,
      enableTooltip
    } = this.getValue();

    const isChangedSizeType = prevSizeType && prevSizeType !== currentSizeType;
    const isChangedSuffix = prevSuffix && prevSuffix !== currentSuffix;

    if ((isChangedSizeType || isChangedSuffix) && device === DESKTOP) {
      updateHoverImageHeight(this.getUtilsContext());
    }

    if (enableTooltip === "on" && prevEnableTooltip !== enableTooltip) {
      this.tooltipRef.current?.openTooltip();
    }
  }

  componentWillUnmount() {
    this.mounted = false;

    super.componentWillUnmount();
  }

  patchValue(patch: Patch, meta = {}) {
    const image = this.handleImageChange(patch);

    const needToUpdateTooltip = shouldUpdateTooltipByPatch(patch);

    if (needToUpdateTooltip) {
      this.tooltipRef.current?.updatePopper();
    }

    const newPatch = { ...patch, ...image } as Patch;

    super.patchValue(newPatch, meta);
  }

  handleImageChange(patch: Patch): Record<string, unknown> {
    return handleImageChangePatch(patch, this.getUtilsContext());
  }

  handleResize = () => {
    if (!isStory(this.props.editorMode)) {
      updateContainerWidth(this.getUtilsContext());

      const { v } = this.getValue2();
      if (v.hoverImageSrc) {
        updateHoverImageHeight(this.getUtilsContext());
      }
    }

    this.props.onResize();

    if (this.tooltipRef.current) {
      this.tooltipRef.current.updatePopper();
    }
  };

  handleChange = (patch: Patch) => {
    this.patchValue(patch);
  };

  handleBoxResizerChange = (patch: Patch) => {
    if (this.state.isDragging) {
      // INFO: we need to reset this flag after migration of image because our resizer works with internal state
      // and because of this handleValueChange is not called initially to reset the "dbValueMigrated"
      this.dbValueMigrated = undefined;
      this.setState({ sizePatch: patch });
    } else {
      this.handleChange(patch);
    }
  };

  onDragStart = () => {
    this.setState({ isDragging: true });
  };

  onDragEnd = () => {
    const sizePatch = this.state.sizePatch;
    this.setState({ isDragging: false, sizePatch: null }, () => {
      if (Obj.isObject(sizePatch)) {
        this.handleBoxResizerChange(sizePatch);
      }
    });
  };

  getDimension = (size: "width" | "height"): number | undefined => {
    return getDimension(this.container, size);
  };

  updateContainerDimensions(
    width: number,
    widthStateKey: "containerWidth" | "tabletContainerWidth" | "mobileContainerWidth"
  ) {
    updateContainerDimensions(
      this.state,
      (updater, callback) => {
        if (typeof updater === "function") {
          this.setState(
            (prevState) => ({ ...prevState, ...updater(prevState) }),
            callback
          );
        } else {
          this.setState((prevState) => ({ ...prevState, ...updater }), callback);
        }
      },
      width,
      widthStateKey
    );
  }

  updateContainerWidth = () => {
    updateContainerWidth(this.getUtilsContext());
  };

  getExtraImageProps(v: Value) {
    return getExtraImageProps(v);
  }

  getImageUrlsFor(
    wrapperSizes: WrapperSizes,
    imageSizes: ImageSizes,
    device: DeviceMode
  ) {
    const v = this.getValue();
    return getImageUrlsFor(v, wrapperSizes, imageSizes, device, this.getGlobalConfig());
  }

  getHoverImageUrlsFor(wrapperSizes: WrapperSizes, imageSizes: ImageSizes) {
    const v = this.getValue();
    return getHoverImageUrlsFor(v, wrapperSizes, imageSizes, this.getGlobalConfig());
  }

  getResponsiveUrls(
    wrapperSizes: WrapperSizes,
    imageSizes: ImageSizes
  ): ImagesSources {
    const v = this.getValue();
    return getResponsiveUrls(v, wrapperSizes, imageSizes, this.getGlobalConfig());
  }

  getWrapperSizes(v: Value): ExtendedWrapperSizes {
    return calculateWrapperSizes(v, this.state, this.getGlobalConfig());
  }

  getContainerSize() {
    return getContainerSize(this.state);
  }

  getLightboxClassName() {
    const v = this.getValue();
    const inGallery = Boolean(this.props.renderer?.gallery?.inGallery);

    return {
      "brz-image__lightbox":
        (v.imageSrc || v.imagePopulation) &&
        v.linkLightBox === "on" &&
        !inGallery &&
        !(isSVGExtension(v.imageExtension) || isGIFExtension(v.imageExtension))
    };
  }

  getDBValue() {
    const parentDBValue = super.getDBValue();
    return processDBValue(
      parentDBValue as Value & {
        resize?: number;
        tabletResize?: number;
        mobileResize?: number;
      },
      this.state as ImageComponentState,
      this.getGlobalConfig()
    );
  }

  getDCValueHook(dcKeys: ECKeyDCInfo[], v: Value): ECKeyDCInfo[] {
    return processDCValueHook(dcKeys, v, this.getUtilsContext()) as ECKeyDCInfo[];
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

  renderPopups() {
    const meta = this.props.meta;
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: (itemData: Block) => {
        const { blockId, value } = itemData;
        let { popupId } = value;

        let newMeta = omit(meta, ["globalBlockId"]);

        if (itemData.type === "GlobalBlock") {
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

    // @ts-expect-error: Need transform EditorArrayComponents to ts
    return <EditorArrayComponent {...popupsProps} />;
  }

  getHoverAnimationData(v: Value) {
    const { gallery = {} as GalleryRenderer } = this.props.renderer
      ? this.props.renderer
      : { gallery: {} as GalleryRenderer };
    const { wrapperAnimationId } = this.props.meta;
    const {
      hoverName: galleryHoverName,
      hoverDuration: galleryHoverDuration,
      hoverInfiniteAnimation: galleryHoverInfiniteAnimation,
      inGallery
    } = gallery;
    const { clonedFromGallery = false } = v;
    const animationId = Str.read(wrapperAnimationId) ?? this.getId();
    if (inGallery && !clonedFromGallery) {
      const hoverName = Str.read(galleryHoverName) ?? "none";
      const isHidden = isStory(this.props.editorMode) || hoverName === "none";
      const optionsFromGallery = {
        duration: isPositive(galleryHoverDuration)
          ? galleryHoverDuration
          : (1000 as Positive),
        infiniteAnimation: galleryHoverInfiniteAnimation ?? false
      };

      return {
        hoverName,
        animationId,
        options: getHoverAnimationOptions(optionsFromGallery, hoverName),
        isHidden
      };
    }
    const { hoverName } = v;
    const _hoverName = Str.read(hoverName) ?? "none";
    const isHidden = isStory(this.props.editorMode) || _hoverName === "none";
    const store = this.getReduxStore();
    const options = makeOptionValueToAnimation({ v, store });

    return {
      hoverName: _hoverName,
      animationId,
      options: getHoverAnimationOptions(options, _hoverName),
      isHidden
    };
  }

  renderForEdit(v: Value, vs: Value, vd: Value) {
    const {
      className,
      actionClosePopup,
      imageType,
      hoverImageSrc,
      hoverImage,
      tabsState,
      enableTooltip,
      tooltipPlacement,
      customCSS
    } = v;
    const config = this.getGlobalConfig();

    const { renderer, renderContext, editorMode } = this.props;

    const hasHoverImage = !!hoverImageSrc || !!hoverImage;

    const { gallery = {} as GalleryRenderer } = renderer
      ? renderer
      : { gallery: {} as GalleryRenderer };
    const { containerWidth, tabletContainerWidth, mobileContainerWidth } =
      this.state;

    const wrapperSizes = this.getWrapperSizes(v);

    const toolbarConfig = toolbarConfigFn({
      desktopContainerWidth: containerWidth,
      tabletContainerWidth,
      mobileContainerWidth,
      gallery
    });

    const linked = v.linkExternal !== "" || v.linkPopulation !== "";

    const link = getLinkData(v, config);

    const linkProps = {
      slide: link.slide,
      draggable: false
    };

    const parentClassName = classnames(
      "brz-image",
      isStory(editorMode) && "brz-image--story",
      {
        "brz-story-linked": isStory(editorMode) && linked,
        "brz-image--withHover": hasHoverImage,
        "brz-image-hide-normal": tabsState === HOVER && hasHoverImage
      },
      this.getLightboxClassName(),
      className,
      {
        "brz-popup2__action-close":
          link.type === "action" && actionClosePopup === "on"
      }
    );

    const classNameContent = classnames(
      "brz-ed-image__content",
      this.css(
        // hard to explain, but because styles are generated from props in this case
        // we can't rely on the usual way of using css(),
        // so we trick it with a custom class for both default and custom classNames
        // `${this.getComponentId()}-content`,
        `${this.getComponentId()}-${this.getId()}-content`,
        `${this.getId()}-content`,
        styleContent({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts(),
          props: {
            ...wrapperSizes,
            showOriginalImage: showOriginalImage(v)
          }
        })
      )
    );

    const meta: Meta = {
      ...this.props.meta,
      desktopW: containerWidth,
      tabletW: tabletContainerWidth,
      mobileW: mobileContainerWidth,
      _dc: this._dc
    };

    const getResponsiveUrlsFn: GetResponsiveUrls | undefined = isUnsplashImage(
      imageType
    )
      ? (imageSizes: ImageSizes) =>
          this.getResponsiveUrls(wrapperSizes, imageSizes)
      : undefined;

    const { animationId, hoverName, options, isHidden } =
      this.getHoverAnimationData(v);
    const { wrapperAnimationActive } = this.props.meta;
    const isDisabledHover = Bool.read(wrapperAnimationActive);
    const isTooltipEnabled = enableTooltip === "on";

    const _tooltipPlacement = isTooltipEnabled
      ? getTooltipPlacement(tooltipPlacement)
      : undefined;

    const mainToolbarPlacement = getToolbarPlacement(_tooltipPlacement);

    const attrs = isTooltipEnabled
      ? makeDataAttr({
          name: "tooltip-wrapper-id",
          value: this.getId()
        })
      : {};

    return (
      <Fragment>
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
          placement={mainToolbarPlacement}
        >
          {({ ref: toolbarRef }) => (
            <CustomCSS selectorName={this.getId()} css={customCSS}>
              {({ ref: customCssRef }) => (
                <Wrapper
                  {...this.makeWrapperProps({
                    className: classnames(parentClassName, classNameContent),
                    ref: (el) => {
                      attachRefs(el, [
                        this.container,
                        toolbarRef,
                        customCssRef
                      ]);
                      this.handleUpdateTooltipReference(el);
                    },
                    attributes: attrs
                  })}
                  onClick={this.handleToggleTooltip}
                >
                  <HoverAnimation
                    animationId={animationId}
                    cssKeyframe={hoverName}
                    options={options}
                    isDisabledHover={isDisabledHover}
                    isHidden={isHidden}
                    withoutWrapper={true}
                  >
                    <ImageWrapper
                      store={this.getReduxStore()}
                      v={v}
                      vs={vs}
                      vd={vd}
                      _id={this.getId()}
                      componentId={this.getComponentId()}
                      wrapperSizes={wrapperSizes}
                      meta={meta}
                      onChange={this.handleBoxResizerChange}
                      onStart={this.onDragStart}
                      onEnd={this.onDragEnd}
                      gallery={gallery}
                      context={this.context}
                      renderContext={renderContext}
                      editorMode={editorMode}
                    >
                      <ImageContent
                        store={this.getReduxStore()}
                        v={v}
                        vs={vs}
                        vd={vd}
                        _id={this.getId()}
                        componentId={this.getComponentId()}
                        wrapperSizes={wrapperSizes}
                        getResponsiveUrls={getResponsiveUrlsFn}
                        meta={meta}
                        gallery={gallery}
                        linkProps={linkProps}
                        renderContext={renderContext}
                        editorMode={editorMode}
                      />
                    </ImageWrapper>
                  </HoverAnimation>
                </Wrapper>
              )}
            </CustomCSS>
          )}
        </Toolbar>
        {isEditor(this.props.renderContext) && (
          <ResizeAware onResize={this.handleResize} />
        )}
        {shouldRenderPopup(v, blocksDataSelector(this.getReduxState())) &&
          this.renderPopups()}
        {isTooltipEnabled && this.renderTooltip(v, vs, vd)}
      </Fragment>
    );
  }

  renderForView(v: Value, vs: Value, vd: Value) {
    const {
      className,
      actionClosePopup,
      hoverImageSrc,
      hoverImage,
      enableTooltip,
      customCSS
    } = v;
    const config = this.getGlobalConfig();
    const isAbsoluteOrFixed =
      v.elementPosition === "absolute" || v.elementPosition === "fixed";
    const { animationId, hoverName, options, isHidden } =
      this.getHoverAnimationData(v);

    const wrapperSizes = this.getWrapperSizes(v);

    // this is needed for dynamic attributes like alt and title
    const extraAttributes = this.getExtraImageProps(v);

    const styleProps = {
      wrapperSizes,
      context: this.context,
      props: this.props
    };

    const link = getLinkData(v, config);

    const linkProps = {
      slide: link.slide
    };

    const linked = v.linkExternal !== "" || v.linkPopulation !== "";

    const parentClassName = classnames(
      "brz-image",
      {
        "brz-story-linked": isStory(this.props.editorMode) && linked,
        "brz-image--withHover": !!hoverImageSrc || !!hoverImage
      },
      { "brz-image--hovered": hoverName !== "none" },
      isAbsoluteOrFixed && "brz-image--story",
      this.getLightboxClassName(),
      className,
      {
        "brz-popup2__action-close":
          link.type === "action" && actionClosePopup === "on"
      },
      this.css(
        `${this.getComponentId()}-${this.getId()}-parent`,
        `${this.getId()}-parent`,
        style({
          v,
          vs,
          vd,
          props: styleProps,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const hoverAnimationClassName = classnames(
      this.css(
        `${this.getComponentId()}-${this.getId()}-parent-hover`,
        `${this.getId()}-parent-hover`,
        styleHover({
          v,
          vs,
          vd,
          props: styleProps,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const isTooltipEnabled = enableTooltip === "on";

    const attrs = isTooltipEnabled
      ? makeDataAttr({
          name: "tooltip-wrapper-id",
          value: this.getId()
        })
      : {};

    return (
      <Fragment>
        <CustomCSS selectorName={this.getId()} css={customCSS}>
          <HoverAnimation
            animationId={animationId}
            className={hoverAnimationClassName}
            cssKeyframe={hoverName}
            options={options}
            isHidden={isHidden}
            withoutWrapper={true}
          >
            <Wrapper
              {...this.makeWrapperProps({
                className: parentClassName,
                ref: this.container,
                attributes: attrs
              })}
            >
              <ImageContent
                v={v}
                vs={vs}
                vd={vd}
                _id={this.getId()}
                componentId={this.getComponentId()}
                wrapperSizes={wrapperSizes}
                meta={this.props.meta}
                extraAttributes={extraAttributes}
                getResponsiveUrls={(imageSizes: ImageSizes) =>
                  this.getResponsiveUrls(wrapperSizes, imageSizes)
                }
                linkProps={linkProps}
                store={this.getReduxStore()}
                renderContext={this.props.renderContext}
                editorMode={this.props.editorMode}
              />
            </Wrapper>
          </HoverAnimation>
        </CustomCSS>
        {shouldRenderPopup(v, blocksDataSelector(this.getReduxState())) &&
          this.renderPopups()}
        {isTooltipEnabled && this.renderTooltip(v, vs, vd)}
      </Fragment>
    );
  }
}

export default withMigrations(Image, migrations);
