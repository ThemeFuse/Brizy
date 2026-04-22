import { Bool, Obj, Str } from "@brizy/readers";
import classnames from "classnames";
import { noop } from "es-toolkit";
import React, { Fragment } from "react";
import ResizeAware from "react-resize-aware";
import { omit } from "timm";
import CustomCSS from "visual/component/CustomCSS";
import { HoverAnimation } from "visual/component/HoverAnimation/HoverAnimation";
import { getHoverAnimationOptions } from "visual/component/HoverAnimation/utils";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent, {
  Props as EditorComponentProps
} from "visual/editorComponents/EditorComponent";
import { ECKeyDCInfo } from "visual/editorComponents/EditorComponent/types";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isEditor, isView } from "visual/providers/RenderProvider";
import { blocksDataSelector } from "visual/redux/selectors";
import { DeviceMode } from "visual/types";
import { Block } from "visual/types/Block";
import { getLinkData } from "visual/utils/models/link";
import { makeOptionValueToAnimation } from "visual/utils/options/utils/makeValueToOptions";
import { attachRefs } from "visual/utils/react";
import { DESKTOP } from "visual/utils/responsiveMode";
import { HOVER } from "visual/utils/stateMode";
import ImageWrapper from "../Image/Wrapper";
import {
  ExtendedWrapperSizes,
  ImageComponentState,
  ImageUtilsContext,
  calculateWrapperSizes,
  getContainerSize,
  getDimension,
  getExtraImageProps,
  getHoverImageUrlsFor,
  getImageUrlsFor,
  getResponsiveUrls,
  handleImageChangePatch,
  processDBValue,
  processDCValueHook,
  updateContainerDimensions,
  updateContainerWidth,
  updateHoverImageHeight
} from "../Image/shared";
import {
  ImageSizes,
  ImagesSources,
  Meta,
  Patch,
  State,
  V as Value,
  WrapperSizes
} from "../Image/types";
import { showOriginalImage } from "../Image/utils";
import { Wrapper } from "../tools/Wrapper";
import ImageContent from "./components";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style, styleContent, styleHover, styleSlider } from "./styles";
import toolbarConfigFn from "./toolbar";
import { Props } from "./types";

export class ImageComparison extends EditorComponent<Value, Props, State> {
  static defaultProps = {
    meta: {},
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

  mounted = false;

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

  static get componentId(): ElementTypes.ImageComparison {
    return ElementTypes.ImageComparison;
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
          this.setState(
            (prevState) => ({ ...prevState, ...updater }),
            callback
          );
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
    const { sizeType: prevSizeType, heightSuffix: prevSuffix } =
      prevProps.dbValue;

    const { sizeType: currentSizeType, heightSuffix: currentSuffix } =
      this.getValue();

    const isChangedSizeType = prevSizeType && prevSizeType !== currentSizeType;
    const isChangedSuffix = prevSuffix && prevSuffix !== currentSuffix;

    if ((isChangedSizeType || isChangedSuffix) && device === DESKTOP) {
      updateHoverImageHeight(this.getUtilsContext());
    }
  }

  componentWillUnmount() {
    this.mounted = false;

    super.componentWillUnmount();
  }

  patchValue(patch: Patch, meta = {}) {
    const image = this.handleImageChange(patch);

    const newPatch = { ...patch, ...image } as Patch;

    super.patchValue(newPatch, meta);
  }

  handleImageChange(patch: Patch): Record<string, unknown> {
    return handleImageChangePatch(patch, this.getUtilsContext());
  }

  handleResize = () => {
    updateContainerWidth(this.getUtilsContext());

    const { v } = this.getValue2();
    if (v.hoverImageSrc) {
      updateHoverImageHeight(this.getUtilsContext());
    }
  };

  handleChange = (patch: Patch) => {
    this.patchValue(patch);
  };

  handleBoxResizerChange = (patch: Patch) => {
    if (this.state.isDragging) {
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
    widthStateKey:
      | "containerWidth"
      | "tabletContainerWidth"
      | "mobileContainerWidth"
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
          this.setState(
            (prevState) => ({ ...prevState, ...updater }),
            callback
          );
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
    return getImageUrlsFor(
      v,
      wrapperSizes,
      imageSizes,
      device,
      this.getGlobalConfig()
    );
  }

  getHoverImageUrlsFor(wrapperSizes: WrapperSizes, imageSizes: ImageSizes) {
    const v = this.getValue();
    return getHoverImageUrlsFor(
      v,
      wrapperSizes,
      imageSizes,
      this.getGlobalConfig()
    );
  }

  getResponsiveUrls(
    wrapperSizes: WrapperSizes,
    imageSizes: ImageSizes
  ): ImagesSources {
    const v = this.getValue();
    return getResponsiveUrls(
      v,
      wrapperSizes,
      imageSizes,
      this.getGlobalConfig()
    );
  }

  getWrapperSizes(v: Value): ExtendedWrapperSizes {
    return calculateWrapperSizes(v, this.state, this.getGlobalConfig());
  }

  getContainerSize() {
    return getContainerSize(this.state);
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
    return processDCValueHook(
      dcKeys,
      v,
      this.getUtilsContext()
    ) as ECKeyDCInfo[];
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
    const { wrapperAnimationId } = this.props.meta;
    const animationId = Str.read(wrapperAnimationId) ?? this.getId();
    const { hoverName } = v;
    const _hoverName = Str.read(hoverName) ?? "none";
    const isHidden = _hoverName === "none";
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
      hoverImageSrc,
      hoverImage,
      tabsState,
      customCSS
    } = v;
    const config = this.getGlobalConfig();

    const { renderContext, editorMode } = this.props;

    const hasHoverImage = !!hoverImageSrc || !!hoverImage;

    const { containerWidth, tabletContainerWidth, mobileContainerWidth } =
      this.state;

    const wrapperSizes = this.getWrapperSizes(v);

    const toolbarConfig = toolbarConfigFn({
      desktopContainerWidth: containerWidth,
      tabletContainerWidth,
      mobileContainerWidth
    });

    const link = getLinkData(v, config);

    const linkProps = {
      slide: link.slide,
      draggable: false
    };

    const styleProps = {
      wrapperSizes,
      context: this.context,
      props: this.props
    };

    const parentClassName = classnames(
      "brz-image",
      "brz-image-comparison",
      {
        "brz-image--withHover": hasHoverImage,
        "brz-image-hide-normal": tabsState === HOVER && hasHoverImage
      },
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

    const classNameContent = classnames(
      "brz-ed-image__content",
      this.css(
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

    const { animationId, hoverName, options, isHidden } =
      this.getHoverAnimationData(v);
    const { wrapperAnimationActive } = this.props.meta;
    const isDisabledHover = Bool.read(wrapperAnimationActive);

    return (
      <Fragment>
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
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
                    }
                  })}
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
                      context={this.context}
                      renderContext={renderContext}
                      editorMode={editorMode}
                      showFilter={false}
                    >
                      <ImageContent
                        store={this.getReduxStore()}
                        v={v}
                        vs={vs}
                        vd={vd}
                        _id={this.getId()}
                        componentId={this.getComponentId()}
                        wrapperSizes={wrapperSizes}
                        meta={meta}
                        linkProps={linkProps}
                        renderContext={renderContext}
                        editorMode={editorMode}
                        onChange={this.handleChange}
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
      </Fragment>
    );
  }

  renderForView(v: Value, vs: Value, vd: Value) {
    const { className, actionClosePopup, customCSS } = v;
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

    const parentClassName = classnames(
      "brz-image",
      "brz-image-comparison",
      { "brz-image--hovered": hoverName !== "none" },
      isAbsoluteOrFixed && "brz-image--story",
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
      ),
      this.css(
        `${this.getComponentId()}-${this.getId()}-slider`,
        `${this.getId()}-slider`,
        styleSlider({
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
                ref: this.container
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
                linkProps={linkProps}
                store={this.getReduxStore()}
                renderContext={this.props.renderContext}
                editorMode={this.props.editorMode}
                onChange={this.handleChange}
              />
            </Wrapper>
          </HoverAnimation>
        </CustomCSS>
        {shouldRenderPopup(v, blocksDataSelector(this.getReduxState())) &&
          this.renderPopups()}
      </Fragment>
    );
  }
}
