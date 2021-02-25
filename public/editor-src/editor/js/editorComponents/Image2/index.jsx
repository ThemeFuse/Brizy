import React, { Fragment } from "react";
import _ from "underscore";
import ResizeAware from "react-resize-aware";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import { imageUrl, imagePopulationUrl } from "visual/utils/image";
import { getStore } from "visual/redux/store";
import { blocksDataSelector } from "visual/redux/selectors";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import toolbarConfigFn from "./toolbar";
import { calcWrapperSizes } from "./utils";
import classnames from "classnames";
import { css } from "visual/utils/cssStyle";
import { style, styleContent } from "./styles";
import { Wrapper } from "../tools/Wrapper";
import { isSVG, isGIF } from "./utils";

import ImageWrapper from "./Wrapper";
import ImageContent from "./Image";
import { IS_STORY } from "visual/utils/models";

class Image extends EditorComponent {
  static get componentId() {
    return "Image";
  }

  static defaultProps = {
    meta: {},
    onResize: _.noop
  };

  static defaultValue = defaultValue;

  constructor(props) {
    super(props);
    const { desktopW: containerWidth } = this.props.meta;

    this.state = {
      containerWidth
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

  handleResize = () => {
    this.updateContainerWidth();
    this.props.onResize();
  };

  handleChange = patch => {
    this.patchValue(patch);
  };

  updateContainerWidth = () => {
    if (!this.mounted) {
      return;
    }

    const { containerWidth: stateContainerWidth } = this.state;

    if (getStore().getState().ui.deviceMode === "desktop") {
      const containerWidth = this.container.current.parentElement.clientWidth;

      if (containerWidth !== stateContainerWidth) {
        this.setState({ containerWidth });
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

    let { width: iW, height: iH, marginLeft: oX, marginTop: oY } = imageSizes[
      device
    ];

    oX = Math.abs(oX);
    oY = Math.abs(oY);

    const urlFn = v.imagePopulation ? imagePopulationUrl : imageUrl;
    const src = v.imagePopulation ? v.imagePopulation : v.imageSrc;
    const options = v.imagePopulation
      ? { cW: Math.round(cW), cH: Math.round(cH) }
      : {
          iW: Math.round(iW),
          iH: Math.round(iH),
          oX: Math.round(oX),
          oY: Math.round(oY),
          cW: Math.round(cW),
          cH: Math.round(cH)
        };

    return {
      source: urlFn(src, options),
      url: `${urlFn(src, options)} 1x, ${urlFn(src, multiplier(options, 2))} 2x`
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
    const { containerWidth } = this.state;
    const {
      imageWidth,
      imageHeight,
      width,
      height,
      widthSuffix,
      heightSuffix
    } = v;
    const { tabletW, mobileW } = this.props.meta;

    const desktopValue = {
      imageWidth,
      imageHeight,
      width,
      height,
      widthSuffix,
      heightSuffix
    };
    const tabletValue = {
      imageWidth,
      imageHeight,
      width: v.tabletWidth || width,
      height: v.tabletHeight || height,
      widthSuffix: tabletSyncOnChange(v, "widthSuffix"),
      heightSuffix: tabletSyncOnChange(v, "heightSuffix")
    };
    const mobileValue = {
      imageWidth,
      imageHeight,
      width: v.mobileWidth || width,
      height: v.mobileHeight || v.height,
      widthSuffix: mobileSyncOnChange(v, "widthSuffix"),
      heightSuffix: mobileSyncOnChange(v, "heightSuffix")
    };
    return {
      desktop: calcWrapperSizes(desktopValue, containerWidth),
      tablet: calcWrapperSizes(tabletValue, tabletW),
      mobile: calcWrapperSizes(mobileValue, mobileW)
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

    return {
      ...dbValue,
      ...value
    };
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
    const { tabletW, mobileW, gallery = {} } = this.props.meta;
    const { containerWidth } = this.state;

    const wrapperSizes = this.getWrapperSizes(v);

    const toolbarConfig = toolbarConfigFn({
      desktopWrapperSizes: wrapperSizes.desktop,
      desktopContainerWidth: containerWidth,
      tabletWrapperSizes: wrapperSizes.tablet,
      tabletContainerWidth: tabletW,
      mobileWrapperSizes: wrapperSizes.mobile,
      mobileContainerWidth: mobileW,
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
      desktopW: containerWidth
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
