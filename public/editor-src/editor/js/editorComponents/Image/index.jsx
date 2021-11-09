import React, { Fragment } from "react";
import _ from "underscore";
import classnames from "classnames";
import ResizeAware from "react-resize-aware";
import Config from "visual/global/Config";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import {
  imagePopulationUrl,
  imageSpecificSize,
  imageUrl
} from "visual/utils/image";
import { getStore } from "visual/redux/store";
import { blocksDataSelector, deviceModeSelector } from "visual/redux/selectors";
import {
  defaultValueValue,
  mobileSyncOnChange,
  tabletSyncOnChange
} from "visual/utils/onChange";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import toolbarConfigFn from "./toolbar";
import { css } from "visual/utils/cssStyle";
import { style, styleContent } from "./styles";
import { Wrapper } from "../tools/Wrapper";
import {
  calcWrapperOriginalSizes,
  calcWrapperPredefinedSizes,
  calcWrapperSizes,
  getImageSize,
  getSizeType,
  isGIF,
  isOriginalSize,
  isPredefinedSize,
  isSVG
} from "./utils";
import { isNumber } from "visual/utils/math";

import ImageWrapper from "./Wrapper";
import ImageContent from "./Image";
import { IS_STORY } from "visual/utils/models";
import * as ImagePatch from "./types/ImagePatch";
import {
  elementModelToValue,
  patchOnDCChange,
  patchOnImageChange,
  patchOnSizeTypeChange
} from "./imageChange";
import {
  placeholderObjFromStr,
  placeholderObjToStr
} from "visual/editorComponents/EditorComponent/DynamicContent/utils";

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
      mobileContainerWidth: mobileW
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
    const value = elementModelToValue(v);
    const image = ImagePatch.fromImageElementModel(patch);

    const imageDC = ImagePatch.fromImageDCElementModel(patch);

    const imageSizeType = ImagePatch.patchImageSizeType(patch);

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

      return patchOnDCChange(containerWidth, patch, wrapperSize);
    }

    const sizeType = defaultValueValue({ v, device, key: "sizeType" });
    if (imageSizeType !== undefined && imageSizeType.sizeType !== sizeType) {
      const containerWidth = this.getContainerSize()[device];

      return patchOnSizeTypeChange(containerWidth, value, imageSizeType);
    }

    return {};
  }

  handleResize = () => {
    if (!IS_STORY) {
      this.updateContainerWidth();
    }
    this.props.onResize();
  };

  handleChange = patch => {
    this.patchValue(patch);
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
      const src = v.imagePopulation;
      const options = { cW: Math.round(cW), cH: Math.round(cH) };
      const url = imagePopulationUrl(src, options);

      return {
        source: url,
        url: `${url} 1x, ${imagePopulationUrl(src, multiplier(options, 2))} 2x`
      };
    }

    const sizeType = defaultValueValue({ v, device, key: "sizeType" });
    const size = getImageSize(sizeType);

    if (isPredefinedSize(size) || isOriginalSize(size)) {
      const url = imageSpecificSize(v.imageSrc, sizeType);

      return {
        source: url,
        url: `${url} 1x, ${url} 2x`
      };
    }

    let { width: iW, height: iH, marginLeft: oX, marginTop: oY } = imageSizes[
      device
    ];

    oX = Math.abs(oX);
    oY = Math.abs(oY);
    const src = v.imageSrc;
    const options = {
      iW: Math.round(iW),
      iH: Math.round(iH),
      oX: Math.round(oX),
      oY: Math.round(oY),
      cW: Math.round(cW),
      cH: Math.round(cH)
    };
    const url = imageUrl(src, options);

    return {
      source: url,
      url: `${url} 1x, ${imageUrl(src, multiplier(options, 2))} 2x`
    };

    function multiplier(data, num) {
      return Object.entries(data).reduce((acc, [key, value]) => {
        acc[key] = value * num;
        return acc;
      }, {});
    }
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
    const {
      containerWidth,
      tabletContainerWidth,
      mobileContainerWidth
    } = this.state;
    const {
      imageWidth,
      imageHeight,
      width,
      height,
      widthSuffix,
      heightSuffix
    } = v;
    const _sizeType = getSizeType(v, DESKTOP);
    const _tabletSizeType = getSizeType(v, TABLET);
    const _mobileSizeType = getSizeType(v, MOBILE);

    const sizeType = getImageSize(_sizeType);
    const tabletSizeType = getImageSize(_tabletSizeType);
    const mobileSizeType = getImageSize(_mobileSizeType);
    const { desktop, tablet, mobile } = this.getContainerSize();

    if (isPredefinedSize(sizeType)) {
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
      width,
      height,
      widthSuffix,
      heightSuffix,
      size
    };
    const tabletValue = {
      imageWidth,
      imageHeight,
      size: tabletSize,
      width: v.tabletWidth || width,
      height: v.tabletHeight || height,
      widthSuffix: tabletSyncOnChange(v, "widthSuffix"),
      heightSuffix: tabletSyncOnChange(v, "heightSuffix")
    };
    const mobileValue = {
      imageWidth,
      imageHeight,
      size: mobileSize,
      width: v.mobileWidth || width,
      height: v.mobileHeight || height,
      widthSuffix: mobileSyncOnChange(v, "widthSuffix"),
      heightSuffix: mobileSyncOnChange(v, "heightSuffix")
    };

    if (isOriginalSize(sizeType)) {
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
    const inGallery = Boolean(this.props.meta?.gallery?.inGallery);

    return {
      "brz-image__lightbox":
        (v.imageSrc || v.imagePopulation) &&
        v.linkLightBox === "on" &&
        !inGallery &&
        !(isSVG(v.imageExtension) || isGIF(v.imageExtension))
    };
  }

  getDBValue() {
    const {
      resize,
      tabletResize,
      mobileResize,
      ...dbValue
    } = super.getDBValue();

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
      const placeholderData = placeholderObjFromStr(dbValue.imagePopulation);
      const attr = placeholderData?.attr;
      const name = placeholderData?.name;

      if (name !== undefined && attr?.size !== undefined) {
        const { imageSizes } = Config.getAll();
        const imageData = imageSizes?.find(({ name }) => name === attr.size);

        if (imageSizes !== undefined && imageData === undefined) {
          const _attr = { ...attr, size: "original" };
          value = {
            ...value,
            imagePopulation: placeholderObjToStr({ name, attr: _attr })
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

    return {
      ...dbValue,
      ...value
    };
  }

  getDCValueHook(dcKeys, v) {
    const wrapperSizes = this.getWrapperSizes(v);
    const { deviceMode } = getStore().getState().ui;

    return dcKeys.map(dcKey => {
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

        return {
          ...dcKey,
          key: "imageSrc",
          attr: {
            ...dcKey.attr,
            cW: Math.round(cW),
            cH: Math.round(cH),
            disableCrop: IS_EDITOR
          }
        };
      }

      return dcKey;
    });
  }

  renderPopups(v) {
    const { popups, linkLightBox, linkPopup } = v;
    const linkType = linkLightBox === "on" ? "lightBox" : v.linkType;

    if (popups.length > 0 && linkType !== "popup" && linkPopup !== "") {
      return null;
    }

    const normalizePopups = popups.reduce((acc, popup) => {
      let itemData = popup;

      if (itemData.type === "GlobalBlock") {
        // TODO: some kind of error handling
        itemData = blocksDataSelector(getStore().getState())[
          itemData.value._id
        ];
      }

      return itemData ? [...acc, itemData] : acc;
    }, []);

    if (normalizePopups.length === 0) {
      return null;
    }

    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: itemData => {
        let {
          blockId,
          value: { popupId }
        } = itemData;

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          const blockData = blocksDataSelector(getStore().getState())[
            itemData.value._id
          ];

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

  renderForEdit(v, vs, vd) {
    const { className } = v;
    const { gallery = {} } = this.props.meta;
    const {
      containerWidth,
      tabletContainerWidth,
      mobileContainerWidth
    } = this.state;

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
        styleContent(v, vs, vd, wrapperSizes)
      )
    );

    const meta = {
      ...this.props.meta,
      desktopW: containerWidth,
      tabletW: tabletContainerWidth,
      mobileW: mobileContainerWidth,
      _dc: this._dc
    };

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
              <ImageWrapper
                v={v}
                vs={vs}
                vd={vd}
                _id={this.getId()}
                componentId={this.constructor.componentId}
                wrapperSizes={wrapperSizes}
                meta={meta}
                onChange={this.handleChange}
              >
                <ImageContent
                  v={v}
                  vs={vs}
                  vd={vd}
                  _id={this.getId()}
                  componentId={this.constructor.componentId}
                  wrapperSizes={wrapperSizes}
                  meta={meta}
                />
              </ImageWrapper>
            </CustomCSS>
          </Toolbar>
        </Wrapper>
        {IS_EDITOR && <ResizeAware onResize={this.handleResize} />}
        {this.renderPopups(v)}
      </Fragment>
    );
  }

  renderForView(v, vs, vd) {
    const { className } = v;
    const isAbsoluteOrFixed =
      v.elementPosition === "absolute" || v.elementPosition === "fixed";

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
      isAbsoluteOrFixed && "brz-image--story",
      this.getLightboxClassName(),
      className,
      css(
        `${this.constructor.componentId}-${this.getId()}-parent`,
        `${this.getId()}-parent`,
        style(v, vs, vd, styleProps)
      )
    );

    return (
      <Fragment>
        <Wrapper
          {...this.makeWrapperProps({
            className: parentClassName,
            ref: this.container
          })}
        >
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            <ImageContent
              v={v}
              vs={vs}
              vd={vd}
              _id={this.getId()}
              componentId={this.constructor.componentId}
              wrapperSizes={wrapperSizes}
              meta={this.props.meta}
              extraAttributes={extraAttributes}
              getResponsiveUrls={imageSizes =>
                this.getResponsiveUrls(wrapperSizes, imageSizes)
              }
              onChange={this.handleChange}
            />
          </CustomCSS>
        </Wrapper>
        {this.renderPopups(v)}
      </Fragment>
    );
  }
}

export default Image;
