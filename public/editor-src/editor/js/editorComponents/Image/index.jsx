import classnames from "classnames";
import React, { Fragment } from "react";
import ResizeAware from "react-resize-aware";
import _ from "underscore";
import CustomCSS from "visual/component/CustomCSS";
import { HoverAnimation } from "visual/component/HoverAnimation/HoverAnimation";
import { getHoverAnimationOptions } from "visual/component/HoverAnimation/utils";
import { fromElementModel } from "visual/component/Options/types/dev/ImageUpload/converters";
import { makeOptionValueToAnimation } from "visual/component/Options/types/utils/makeValueToOptions";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import {
  keyToDCFallback2Key,
  placeholderObjFromStr,
  placeholderObjToStr
} from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import Config from "visual/global/Config";
import { blocksDataSelector, deviceModeSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { css } from "visual/utils/cssStyle";
import { imagePopulationUrl } from "visual/utils/image";
import { isNumber } from "visual/utils/math";
import { isStory } from "visual/utils/models";
import {
  defaultValueValue,
  mobileSyncOnChange,
  tabletSyncOnChange
} from "visual/utils/onChange";
import { read as readBoolean } from "visual/utils/reader/bool";
import { read as readNumber } from "visual/utils/reader/number";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import { read as readString } from "visual/utils/string/specs";
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
  isGIF,
  isOriginalSize,
  isPredefinedSize,
  isSVG,
  multiplier,
  showOriginalImage
} from "./utils";

class Image extends EditorComponent {
  static get componentId() {
    return "Image";
  }

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

  container = React.createRef();

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
    const device = deviceModeSelector(getStore().getState());
    const { v } = this.getValue2();
    const dvv = (key) => defaultValueValue({ v, device, key });
    const value = elementModelToValue(v);
    const image = ImagePatch.fromImageElementModel(patch);

    const imageDC = ImagePatch.fromImageDCElementModel(patch);

    const imageSizeType = ImagePatch.patchImageSizeType(patch);

    const imageUnit = ImagePatch.patchImageUnit(patch, device);

    if (value === undefined) {
      return {};
    }

    if (image !== undefined) {
      const wrapperSize = this.getWrapperSizes(v)[device];
      const containerWidth = this.getContainerSize()[device];

      return patchOnImageChange(containerWidth, value, wrapperSize, image);
    }

    if (imageDC !== undefined) {
      const wrapperSize = this.getWrapperSizes(v)[device];
      const containerWidth = this.getContainerSize()[device];
      const useCustomPlaceholder =
        Config.getAll().dynamicContent?.useCustomPlaceholder ?? false;

      return patchOnDCChange(
        containerWidth,
        patch,
        wrapperSize,
        useCustomPlaceholder
      );
    }

    if (imageUnit !== undefined) {
      const containerWidth = this.getContainerSize()[device];

      return pathOnUnitChange(containerWidth, value, imageUnit, device);
    }

    const sizeType = dvv("sizeType");
    if (imageSizeType !== undefined && imageSizeType.sizeType !== sizeType) {
      const containerWidth = this.getContainerSize()[device];

      return patchOnSizeTypeChange(containerWidth, imageSizeType);
    }

    return {};
  }

  handleResize = () => {
    const IS_STORY = isStory(Config.getAll());
    if (!IS_STORY) {
      this.updateContainerWidth();
    }
    this.props.onResize();
  };

  handleChange = (patch) => {
    this.patchValue(patch);
  };

  handleBoxResizerChange = (patch) => {
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
    this.setState({ isDragging: false, sizePatch: null }, () =>
      this.handleBoxResizerChange(sizePatch)
    );
  };

  getWidth = () => {
    const parentNode = this.container?.current?.parentElement;
    const parentWidth = parentNode?.getBoundingClientRect().width;

    if (parentNode && isNumber(parentWidth)) {
      const cs = getComputedStyle(parentNode);

      const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      const borderX =
        parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

      return parentWidth - paddingX - borderX;
    }

    return undefined;
  };

  updateContainerWidth = () => {
    if (!this.mounted) {
      return;
    }

    const deviceMode = getStore().getState().ui.deviceMode;
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
      const useCustomPlaceholder =
        Config.getAll().dynamicContent?.useCustomPlaceholder ?? false;
      const src = v.imageSrc;
      const options = { cW: Math.round(cW), cH: Math.round(cH) };
      const options2X = multiplier(options, 2);
      const url = imagePopulationUrl(src, { ...options, useCustomPlaceholder });

      return {
        source: url,
        url: `${url} 1x, ${imagePopulationUrl(src, {
          ...options2X,
          useCustomPlaceholder
        })} 2x`
      };
    }

    const dvv = (key) => defaultValueValue({ v, key, device });
    return getCustomImageUrl(
      fromElementModel(dvv),
      wrapperSizes[device],
      imageSizes[device]
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
      (isSVG(imageExtension) || isGIF(imageExtension)) && !imagePopulation;
    const _sizeType = getSizeType(v, DESKTOP);
    const _tabletSizeType = getSizeType(v, TABLET);
    const _mobileSizeType = getSizeType(v, MOBILE);

    const sizeType = getImageSize(_sizeType);
    const tabletSizeType = getImageSize(_tabletSizeType);
    const mobileSizeType = getImageSize(_mobileSizeType);
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
        !(isSVG(v.imageExtension) || isGIF(v.imageExtension))
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

    if (dbValue.imagePopulation) {
      const { imageSizes, dynamicContent } = Config.getAll();
      const useCustomPlaceholder =
        dynamicContent?.useCustomPlaceholder ?? false;
      const placeholderData = placeholderObjFromStr(
        dbValue.imagePopulation,
        useCustomPlaceholder
      );
      const attr = placeholderData?.attr;
      const name = placeholderData?.name;

      if (name !== undefined && attr?.size !== undefined) {
        const imageData = imageSizes?.find(({ name }) => name === attr.size);

        if (imageSizes !== undefined && imageData === undefined) {
          const _attr = { ...attr, size: "original" };

          value = {
            ...value,
            imagePopulation: placeholderObjToStr(
              { name, attr: _attr },
              useCustomPlaceholder
            )
          };
        }
      }
    }

    if (dbValue.sizeType !== undefined && dbValue.sizeType !== "custom") {
      const { imageSizes } = Config.getAll();
      const imageData = imageSizes?.find(
        ({ name }) => name === dbValue.sizeType
      );
      if (imageData === undefined) {
        dbValue.sizeType = "original";
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
    const { deviceMode } = getStore().getState().ui;
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
            IS_PREVIEW
          )
        ).source;

        return {
          ...dcKey,
          key: "imageSrc",
          attr: {
            ...dcKey.attr,
            cW: Math.round(cW),
            cH: Math.round(cH),
            disableCrop: IS_EDITOR
          },
          ...(fallbackUrl ? { fallback: fallbackUrl } : {})
        };
      }

      return dcKey;
    });
  }

  renderPopups() {
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: (itemData) => {
        let {
          blockId,
          value: { popupId }
        } = itemData;

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

    const animationId = readString(wrapperAnimationId) ?? this.getId();

    if (inGallery) {
      const hoverName = readString(galleryHoverName) ?? "none";
      const optionsFromGallery = {
        duration: readNumber(galleryHoverDuration) ?? 1000,
        infiniteAnimation: galleryHoverInfiniteAnimation ?? false
      };

      return {
        hoverName,
        animationId,
        options: getHoverAnimationOptions(optionsFromGallery, hoverName)
      };
    }
    const { hoverName } = v;
    const _hoverName = readString(hoverName) ?? "none";
    const options = makeOptionValueToAnimation(v);

    return {
      hoverName: _hoverName,
      animationId,
      options: getHoverAnimationOptions(options, _hoverName)
    };
  }

  renderForEdit(v, vs, vd) {
    const { className } = v;
    const IS_STORY = isStory(Config.getAll());
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

    const parentClassName = classnames(
      "brz-image",
      IS_STORY && "brz-image--story",
      { "brz-story-linked": IS_STORY && linked },
      this.getLightboxClassName(),
      className
    );

    const classNameContent = classnames(
      "brz-ed-image__content",
      css(
        // hard to explain, but because styles are generated from props in this case
        // we can't rely on the usual way of using css(),
        // so we trick it with a custom class for both default and custom classNames
        // `${this.constructor.componentId}-content`,
        `${this.constructor.componentId}-${this.getId()}-content`,
        `${this.getId()}-content`,
        styleContent(v, vs, vd, {
          ...wrapperSizes,
          showOriginalImage: showOriginalImage(v)
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

    const { animationId, hoverName, options } = this.getHoverAnimationData(v);
    const { wrapperAnimationActive } = this.props.meta;
    const isDisabledHover = readBoolean(wrapperAnimationActive);
    return (
      <Fragment>
        <Wrapper
          {...this.makeWrapperProps({
            className: classnames(parentClassName, classNameContent),
            ref: this.container
          })}
        >
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
          >
            <CustomCSS selectorName={this.getId()} css={v.customCSS}>
              <HoverAnimation
                animationId={animationId}
                cssKeyframe={hoverName}
                options={options}
                isDisabledHover={isDisabledHover}
                isHidden={IS_STORY}
              >
                <ImageWrapper
                  v={v}
                  vs={vs}
                  vd={vd}
                  _id={this.getId()}
                  componentId={this.constructor.componentId}
                  wrapperSizes={wrapperSizes}
                  meta={meta}
                  onChange={this.handleBoxResizerChange}
                  onStart={this.onDragStart}
                  onEnd={this.onDragEnd}
                  gallery={gallery}
                >
                  <ImageContent
                    v={v}
                    vs={vs}
                    vd={vd}
                    _id={this.getId()}
                    componentId={this.constructor.componentId}
                    wrapperSizes={wrapperSizes}
                    meta={meta}
                    gallery={gallery}
                  />
                </ImageWrapper>
              </HoverAnimation>
            </CustomCSS>
          </Toolbar>
        </Wrapper>
        {IS_EDITOR && <ResizeAware onResize={this.handleResize} />}
        {shouldRenderPopup(v, blocksDataSelector(getStore().getState())) &&
          this.renderPopups()}
      </Fragment>
    );
  }

  renderForView(v, vs, vd) {
    const { className } = v;
    const IS_STORY = isStory(Config.getAll());
    const isAbsoluteOrFixed =
      v.elementPosition === "absolute" || v.elementPosition === "fixed";
    const { animationId, hoverName, options } = this.getHoverAnimationData(v);

    const wrapperSizes = this.getWrapperSizes(v);

    // this is needed for dynamic attributes like alt and title
    const extraAttributes = this.getExtraImageProps(v);

    const styleProps = {
      wrapperSizes,
      props: this.props
    };

    const linked = v.linkExternal !== "" || v.linkPopulation !== "";

    const parentClassName = classnames(
      "brz-image",
      { "brz-story-linked": IS_STORY && linked },
      { "brz-image--hovered": hoverName !== "none" },
      isAbsoluteOrFixed && "brz-image--story",
      this.getLightboxClassName(),
      className,
      css(
        `${this.getComponentId()}-${this.getId()}-parent`,
        `${this.getId()}-parent`,
        style(v, vs, vd, styleProps)
      )
    );

    const hoverAnimationClassName = classnames(
      css(
        `${this.getComponentId()}-${this.getId()}-parent-hover`,
        `${this.getId()}-parent-hover`,
        styleHover(v, vs, vd, styleProps)
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
            isHidden={hoverName === "none" || IS_STORY}
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
                componentId={this.constructor.componentId}
                wrapperSizes={wrapperSizes}
                meta={this.props.meta}
                extraAttributes={extraAttributes}
                getResponsiveUrls={(imageSizes) =>
                  this.getResponsiveUrls(wrapperSizes, imageSizes)
                }
                onChange={this.handleChange}
              />
            </Wrapper>
          </HoverAnimation>
        </CustomCSS>
        {shouldRenderPopup(v, blocksDataSelector(getStore().getState())) &&
          this.renderPopups()}
      </Fragment>
    );
  }
}

export default Image;
