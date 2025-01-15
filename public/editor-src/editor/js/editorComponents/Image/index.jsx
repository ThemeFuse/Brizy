import { Bool, Num, Str } from "@brizy/readers";
import classnames from "classnames";
import React, { Fragment } from "react";
import ResizeAware from "react-resize-aware";
import { omit } from "timm";
import _ from "underscore";
import CustomCSS from "visual/component/CustomCSS";
import { HoverAnimation } from "visual/component/HoverAnimation/HoverAnimation";
import { getHoverAnimationOptions } from "visual/component/HoverAnimation/utils";
import { getLinkValue } from "visual/component/Link/utils";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { keyToDCFallback2Key } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import { withMigrations } from "visual/editorComponents/tools/withMigrations";
import { isStory } from "visual/global/EditorModeContext";
import { isEditor, isView } from "visual/providers/RenderProvider";
import { blocksDataSelector } from "visual/redux/selectors";
import { imagePopulationUrl } from "visual/utils/image";
import {
  isGIFExtension,
  isSVGExtension,
  isUnsplashImage
} from "visual/utils/image/utils";
import { getLinkData } from "visual/utils/models/link";
import {
  defaultValueValue,
  mobileSyncOnChange,
  tabletSyncOnChange
} from "visual/utils/onChange";
import { fromElementModel } from "visual/utils/options/ImageUpload/converters";
import { makeOptionValueToAnimation } from "visual/utils/options/utils/makeValueToOptions";
import {
  fromLinkElementModel,
  patchOnDCChange as patchOnLinkDCChange
} from "visual/utils/patch/Link/";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import { SizeType } from "../../global/Config/types/configs/common";
import { Wrapper } from "../tools/Wrapper";
import ImageContent from "./Image";
import ImageWrapper from "./Wrapper";
import defaultValue from "./defaultValue.json";
import {
  elementModelToValue,
  patchOnDCChange,
  patchOnImageChange,
  patchOnSizeTypeChange,
  pathOnUnitChange
} from "./imageChange";
import { migrations } from "./migrations";
import * as sidebarConfig from "./sidebar";
import { style, styleContent, styleHover } from "./styles";
import toolbarConfigFn from "./toolbar";
import * as ImagePatch from "./types/ImagePatch";
import {
  calcImageSizes,
  calcWrapperOriginalSizes,
  calcWrapperPredefinedSizes,
  calcWrapperSizes,
  getCustomImageUrl,
  getImageSize,
  getSizeType,
  isOriginalSize,
  isPredefinedSize,
  multiplier,
  showOriginalImage
} from "./utils";

class Image extends EditorComponent {
  static defaultProps = {
    meta: {},
    onResize: _.noop
  };
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;
  prevWrapperSizes = {
    cW: 0,
    cH: 0
  };
  container = React.createRef();

  constructor(props) {
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

  static get componentId() {
    return "Image";
  }

  componentDidMount() {
    this.mounted = true;

    this.handleResize();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  patchValue(patch, meta) {
    const image = this.handleImageChange(patch);
    super.patchValue({ ...patch, ...image }, meta);
  }

  handleImageChange(patch) {
    const { imageSizes: cfgImageSizes } = this.getGlobalConfig();
    const device = this.getDeviceMode();
    const { v } = this.getValue2();
    const dvv = (key) => defaultValueValue({ v, device, key });
    const value = elementModelToValue(v);
    const image = ImagePatch.fromImageElementModel(patch);

    const imageDC = ImagePatch.fromImageDCElementModel(patch);

    const imageSizeType = ImagePatch.patchImageSizeType(patch);

    const imageUnit = ImagePatch.patchImageUnit(patch, device);

    const imageLinkDC = fromLinkElementModel(patch);

    if (value === undefined) {
      return {};
    }

    if (image !== undefined) {
      const wrapperSize = this.getWrapperSizes(v)[device];
      const containerWidth = this.getContainerSize()[device];

      return patchOnImageChange(containerWidth, value, wrapperSize, image);
    }

    if (imageDC !== undefined) {
      const context = this.context;
      const wrapperSize = this.getWrapperSizes(v)[device];
      const containerWidth = this.getContainerSize()[device];

      return patchOnDCChange(
        containerWidth,
        patch,
        wrapperSize,
        context,
        cfgImageSizes
      );
    }

    if (imageUnit !== undefined) {
      const containerWidth = this.getContainerSize()[device];

      return pathOnUnitChange(containerWidth, value, imageUnit, device);
    }

    const sizeType = dvv("sizeType");
    if (imageSizeType !== undefined && imageSizeType.sizeType !== sizeType) {
      const containerWidth = this.getContainerSize()[device];

      return patchOnSizeTypeChange(
        containerWidth,
        imageSizeType,
        cfgImageSizes
      );
    }

    if (imageLinkDC) {
      return patchOnLinkDCChange(imageLinkDC);
    }

    return {};
  }

  handleResize = () => {
    if (!isStory(this.props.editorMode)) {
      this.updateContainerWidth();
    }

    this.props.onResize();
  };

  handleChange = (patch) => {
    this.patchValue(patch);
  };

  handleBoxResizerChange = (patch) => {
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
    this.setState({ isDragging: false, sizePatch: null }, () =>
      this.handleBoxResizerChange(sizePatch)
    );
  };

  getWidth = () => {
    // INFO: the parent element chosen for width can affect the ImageGallery element
    let parentNode = this.container?.current?.parentElement;

    if (parentNode) {
      if (parentNode.classList.contains("brz-wrapper__scrollmotion")) {
        parentNode = parentNode.parentElement;
      }

      const parentWidth = parentNode.getBoundingClientRect().width;

      if (Num.read(parentWidth)) {
        const cs = getComputedStyle(parentNode);

        const paddingX =
          parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
        const borderX =
          parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

        return parentWidth - paddingX - borderX;
      }
    }

    return undefined;
  };

  updateContainerWidth = () => {
    if (!this.mounted) {
      return;
    }

    const deviceMode = this.getDeviceMode();
    const width = this.getWidth();

    if (width !== undefined) {
      switch (deviceMode) {
        case "desktop": {
          if (this.state.containerWidth !== width) {
            this.setState({ containerWidth: width });
          }
          break;
        }
        case "tablet": {
          if (this.state.tabletContainerWidth !== width) {
            this.setState({ tabletContainerWidth: width });
          }
          break;
        }
        case "mobile": {
          if (this.state.mobileContainerWidth !== width) {
            this.setState({ mobileContainerWidth: width });
          }
          break;
        }
      }
    }
  };

  getExtraImageProps(v) {
    return { alt: v.alt };
  }

  getImageUrlsFor(wrapperSizes, imageSizes, device) {
    const v = this.getValue();

    let { width: cW, height: cH } = wrapperSizes[device];
    cW = Math.round(cW);
    cH = Math.round(cH);

    if (v.imagePopulation) {
      const src = v.imageSrc;
      const options = { cW: Math.round(cW), cH: Math.round(cH) };
      const options2X = multiplier(options, 2);
      const url = imagePopulationUrl(src, { ...options });

      return {
        source: url,
        url: `${url} 1x, ${imagePopulationUrl(src, {
          ...options2X
        })} 2x`
      };
    }

    const dvv = (key) => defaultValueValue({ v, key, device });
    const config = this.getGlobalConfig();

    return getCustomImageUrl(
      fromElementModel(dvv),
      wrapperSizes[device],
      imageSizes[device],
      config
    );
  }

  getResponsiveUrls(wrapperSizes, imageSizes) {
    return {
      desktopSrc: this.getImageUrlsFor(wrapperSizes, imageSizes, "desktop").url,
      tabletSrc: this.getImageUrlsFor(wrapperSizes, imageSizes, "tablet").url,
      mobileSrc: this.getImageUrlsFor(wrapperSizes, imageSizes, "mobile").url,
      sourceSrc: this.getImageUrlsFor(wrapperSizes, imageSizes, "desktop")
        .source
    };
  }

  getWrapperSizes(v) {
    const config = this.getGlobalConfig();
    const { imageSizes: cfgImageSizes } = config;

    const { containerWidth, tabletContainerWidth, mobileContainerWidth } =
      this.state;
    const {
      imageExtension,
      imagePopulation,
      imageWidth,
      imageHeight,
      width,
      height,
      widthSuffix,
      heightSuffix
    } = v;
    const isSvgOfGif =
      (isSVGExtension(imageExtension) || isGIFExtension(imageExtension)) &&
      !imagePopulation;
    const _sizeType = getSizeType(v, DESKTOP);
    const _tabletSizeType = getSizeType(v, TABLET);
    const _mobileSizeType = getSizeType(v, MOBILE);

    const sizeType = getImageSize(_sizeType, cfgImageSizes);
    const tabletSizeType = getImageSize(_tabletSizeType, cfgImageSizes);
    const mobileSizeType = getImageSize(_mobileSizeType, cfgImageSizes);
    const { desktop, tablet, mobile } = this.getContainerSize();

    if (isPredefinedSize(sizeType) && !isSvgOfGif) {
      return {
        desktop: calcWrapperPredefinedSizes(sizeType, desktop),
        tablet: calcWrapperPredefinedSizes(tabletSizeType, tablet),
        mobile: calcWrapperPredefinedSizes(mobileSizeType, mobile)
      };
    }

    const dvv = (key, device) => defaultValueValue({ v, device, key });
    const size = dvv("size", DESKTOP);
    const tabletSize = dvv("size", TABLET);
    const mobileSize = dvv("size", MOBILE);

    const desktopValue = {
      imageWidth,
      imageHeight,
      imageExtension,
      width,
      height,
      widthSuffix,
      heightSuffix,
      size
    };
    const tabletValue = {
      imageWidth,
      imageHeight,
      imageExtension,
      size: tabletSize,
      width: v.tabletWidth || width,
      height: v.tabletHeight || height,
      widthSuffix: tabletSyncOnChange(v, "widthSuffix"),
      heightSuffix: tabletSyncOnChange(v, "heightSuffix")
    };
    const mobileValue = {
      imageWidth,
      imageHeight,
      imageExtension,
      size: mobileSize,
      width: v.mobileWidth || width,
      height: v.mobileHeight || height,
      widthSuffix: mobileSyncOnChange(v, "widthSuffix"),
      heightSuffix: mobileSyncOnChange(v, "heightSuffix")
    };

    if (isOriginalSize(sizeType) && !isSvgOfGif) {
      return {
        desktop: calcWrapperOriginalSizes(desktopValue, containerWidth),
        tablet: calcWrapperOriginalSizes(tabletValue, tabletContainerWidth),
        mobile: calcWrapperOriginalSizes(mobileValue, mobileContainerWidth)
      };
    }

    return {
      desktop: calcWrapperSizes(desktopValue, containerWidth),
      tablet: calcWrapperSizes(tabletValue, tabletContainerWidth),
      mobile: calcWrapperSizes(mobileValue, mobileContainerWidth)
    };
  }

  getContainerSize() {
    return {
      desktop: this.state.containerWidth,
      tablet: this.state.tabletContainerWidth,
      mobile: this.state.mobileContainerWidth
    };
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
    const { resize, tabletResize, mobileResize, ...dbValue } =
      super.getDBValue();

    let value = {};
    if (resize) {
      value = {
        ...value,
        width: resize,

        widthSuffix: "%",
        heightSuffix: "%"
      };
    }
    if (tabletResize) {
      value = {
        ...value,
        tabletWidth: tabletResize,

        tabletWidthSuffix: "%",
        tabletHeightSuffix: "%"
      };
    }
    if (mobileResize) {
      value = {
        ...value,
        mobileWidth: mobileResize,

        mobileWidthSuffix: "%",
        mobileHeightSuffix: "%"
      };
    }

    if (dbValue.height && !dbValue.heightSuffix) {
      value = {
        ...value,
        heightSuffix: "%"
      };
    }
    if (dbValue.tabletHeight && !dbValue.tabletHeightSuffix) {
      value = {
        ...value,
        tabletHeightSuffix: "%"
      };
    }
    if (dbValue.mobileHeight && !dbValue.mobileHeightSuffix) {
      value = {
        ...value,
        mobileHeightSuffix: "%"
      };
    }

    if (
      !dbValue.imagePopulation &&
      dbValue.sizeType !== undefined &&
      dbValue.sizeType !== SizeType.custom
    ) {
      const { imageSizes } = this.getGlobalConfig();
      const imageData = imageSizes?.find(
        ({ name }) => name === dbValue.sizeType
      );
      if (imageData === undefined) {
        dbValue.sizeType = SizeType.original;
      }
    }

    const sizeValue = this.state.sizePatch ?? {};

    return {
      ...dbValue,
      ...value,
      ...sizeValue
    };
  }

  getDCValueHook(dcKeys, v) {
    const wrapperSizes = this.getWrapperSizes(v);
    const deviceMode = this.getDeviceMode();
    const dvv = (key) => defaultValueValue({ v, key, device: deviceMode });

    return dcKeys.map((dcKey) => {
      if (dcKey.key === "image") {
        let { width, height } = wrapperSizes[deviceMode];
        let { cW, cH } = this.prevWrapperSizes;

        if (width > cW || height > cH) {
          cW = width;
          cH = height;

          this.prevWrapperSizes = {
            cW: width,
            cH: height
          };
        }

        const fallbackImage = fromElementModel(
          (k) => v[createOptionId(keyToDCFallback2Key(dcKey.key), k)]
        );
        const config = this.getGlobalConfig();
        const fallbackUrl = getCustomImageUrl(
          fallbackImage,
          this.getWrapperSizes(v)[deviceMode],
          calcImageSizes(
            {
              size: dvv("size"),
              width: dvv("width"),
              height: dvv("height"),
              widthSuffix: dvv("widthSuffix"),
              heightSuffix: dvv("heightSuffix"),
              imageHeight: fallbackImage.height,
              imageWidth: fallbackImage.width,
              positionX: fallbackImage.x,
              positionY: fallbackImage.y,
              zoom: dvv("zoom")
            },
            this.props.meta[`${deviceMode}W`],
            isView(this.renderContext)
          ),
          config
        ).source;

        return {
          ...dcKey,
          key: "imageSrc",
          attr: {
            ...dcKey.attr,
            cW: Math.round(cW),
            cH: Math.round(cH),
            disableCrop: isEditor(this.renderContext)
          },
          ...(fallbackUrl ? { fallback: fallbackUrl } : {})
        };
      }

      return dcKey;
    });
  }

  renderPopups() {
    const meta = this.props.meta;
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: (itemData) => {
        let {
          blockId,
          value: { popupId }
        } = itemData;

        let newMeta = omit(meta, ["globalBlockId"]);

        if (itemData.type === "GlobalBlock") {
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

    return <EditorArrayComponent {...popupsProps} />;
  }

  getHoverAnimationData(v) {
    const { gallery = {} } = this.props.renderer
      ? this.props.renderer
      : { gallery: {} };
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
        duration: Num.read(galleryHoverDuration) ?? 1000,
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

  renderForEdit(v, vs, vd) {
    const { className, actionClosePopup, imageType } = v;
    const config = this.getGlobalConfig();
    const { gallery = {} } = this.props.renderer
      ? this.props.renderer
      : { gallery: {} };
    const { containerWidth, tabletContainerWidth, mobileContainerWidth } =
      this.state;

    const wrapperSizes = this.getWrapperSizes(v);

    const toolbarConfig = toolbarConfigFn({
      desktopWrapperSizes: wrapperSizes.desktop,
      desktopContainerWidth: containerWidth,
      tabletWrapperSizes: wrapperSizes.tablet,
      tabletContainerWidth,
      mobileWrapperSizes: wrapperSizes.mobile,
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
      isStory(this.props.editorMode) && "brz-image--story",
      { "brz-story-linked": isStory(this.props.editorMode) && linked },
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
          renderContext: this.renderContext,
          props: {
            ...wrapperSizes,
            showOriginalImage: showOriginalImage(v)
          }
        })
      )
    );

    const meta = {
      ...this.props.meta,
      desktopW: containerWidth,
      tabletW: tabletContainerWidth,
      mobileW: mobileContainerWidth,
      _dc: this._dc
    };

    const getResponsiveUrls = isUnsplashImage(imageType)
      ? (imageSizes) => this.getResponsiveUrls(wrapperSizes, imageSizes)
      : undefined;

    const { animationId, hoverName, options, isHidden } =
      this.getHoverAnimationData(v);
    const { wrapperAnimationActive } = this.props.meta;
    const isDisabledHover = Bool.read(wrapperAnimationActive);
    return (
      <Fragment>
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        >
          <Wrapper
            {...this.makeWrapperProps({
              className: classnames(parentClassName, classNameContent),
              ref: this.container
            })}
          >
            <CustomCSS selectorName={this.getId()} css={v.customCSS}>
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
                >
                  <ImageContent
                    store={this.getReduxStore()}
                    v={v}
                    vs={vs}
                    vd={vd}
                    _id={this.getId()}
                    componentId={this.getComponentId()}
                    wrapperSizes={wrapperSizes}
                    getResponsiveUrls={getResponsiveUrls}
                    meta={meta}
                    gallery={gallery}
                    linkProps={linkProps}
                    renderContext={this.renderContext}
                  />
                </ImageWrapper>
              </HoverAnimation>
            </CustomCSS>
          </Wrapper>
        </Toolbar>
        {isEditor(this.renderContext) && (
          <ResizeAware onResize={this.handleResize} />
        )}
        {shouldRenderPopup(v, blocksDataSelector(this.getReduxState())) &&
          this.renderPopups()}
      </Fragment>
    );
  }

  renderForView(v, vs, vd) {
    const { className, actionClosePopup } = v;
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

    const linkValue = getLinkValue(v);

    const linked = v.linkExternal !== "" || v.linkPopulation !== "";

    const parentClassName = classnames(
      "brz-image",
      { "brz-story-linked": isStory(this.props.editorMode) && linked },
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
          renderContext: this.renderContext
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
          renderContext: this.renderContext
        })
      )
    );

    return (
      <Fragment>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
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
                link={linkValue}
                _id={this.getId()}
                componentId={this.getComponentId()}
                wrapperSizes={wrapperSizes}
                meta={this.props.meta}
                extraAttributes={extraAttributes}
                getResponsiveUrls={(imageSizes) =>
                  this.getResponsiveUrls(wrapperSizes, imageSizes)
                }
                linkProps={linkProps}
                onChange={this.handleChange}
                store={this.getReduxStore()}
                renderContext={this.renderContext}
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

export { Image };
export default withMigrations(Image, migrations);
