import React, { Fragment } from "react";
import _ from "underscore";
import classnames from "classnames";
import ResizeAware from "react-resize-aware";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import CustomCSS from "visual/component/CustomCSS";
import BoxResizer from "visual/component/BoxResizer";
import Placeholder from "visual/component/Placeholder";
import Link from "visual/component/Link";
import Toolbar from "visual/component/Toolbar";
import { MIN_COL_WIDTH } from "visual/config/columns";
import { imageUrl, imagePopulationUrl, svgUrl } from "visual/utils/image";
import { getStore } from "visual/redux/store";
import { blocksDataSelector } from "visual/redux/selectors";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import toolbarConfigFn, {
  getMinSize,
  getMaxSize,
  getMinHeight
} from "./toolbar";
import { calcImageSizes, calcWrapperSizes } from "./calculations";
import {
  imageStylesClassName,
  imageStylesCSSVars,
  contentStyleClassName,
  contentStyleCSSVars,
  wrapperStyleClassName,
  wrapperStyleCSSVars,
  imgStyleClassName,
  imgStyleCSSVars,
  pictureStyleClassName
} from "./styles";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

const resizerPoints = {
  default: [
    "topLeft",
    "topCenter",
    "topRight",
    "bottomLeft",
    "bottomCenter",
    "bottomRight"
  ],
  gallery: ["bottomCenter"],
  svg: ["topLeft", "topRight", "bottomLeft", "bottomRight"]
};

const resizerTransformValue = v => {
  const { resize, ...rest } = v;

  return {
    size: resize,
    tabletSize: tabletSyncOnChange(v, "resize"),
    mobileSize: mobileSyncOnChange(v, "resize"),
    ...rest
  };
};
const resizerTransformPatch = patch => {
  if (patch.size) {
    patch.resize = patch.size;
    delete patch.size;
  }

  if (patch.tabletSize) {
    patch.tabletResize = patch.tabletSize;
    delete patch.tabletSize;
  }

  if (patch.mobileSize) {
    patch.mobileResize = patch.mobileSize;
    delete patch.mobileSize;
  }

  return patch;
};

const isSVG = extension => extension === "svg";

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
    const { desktopW: containerWidth, tabletW, mobileW } = this.props.meta;
    const maxDesktopContainerWidth = Math.round(
      this.getMaxContainerWidth(containerWidth)
    );
    const maxTabletContainerWidth = Math.round(
      this.getMaxContainerWidth(tabletW, "tablet")
    );
    const maxMobileContainerWidth = Math.round(
      this.getMaxContainerWidth(mobileW, "mobile")
    );

    this.state = {
      containerWidth,
      maxDesktopContainerWidth,
      maxTabletContainerWidth,
      maxMobileContainerWidth
    };
  }

  componentDidMount() {
    this.mounted = true;

    this.handleResize();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleContainerRef = el => {
    this.container = el;
  };

  handleResize = () => {
    this.updateContainerMaxWidth();
    this.updateContainerWidth();
    this.props.onResize();
  };

  handleBoxResizerChange = patch => {
    this.patchValue(resizerTransformPatch(patch));
    this.props.onResize();
  };

  updateContainerWidth = () => {
    if (!this.mounted) {
      return;
    }

    const { containerWidth: stateContainerWidth } = this.state;

    if (getStore().getState().ui.deviceMode === "desktop") {
      const containerWidth = this.container.clientWidth;

      if (containerWidth !== stateContainerWidth) {
        this.setState({ containerWidth });
      }
    }
  };

  updateContainerMaxWidth = _.debounce(() => {
    if (!this.mounted) {
      return;
    }

    const { tabletW, mobileW } = this.props.meta;

    const {
      containerWidth,
      maxDesktopContainerWidth: oldMaxDesktopContainerWidth,
      maxTabletContainerWidth: oldMaxTabletContainerWidth,
      maxMobileContainerWidth: oldMaxMobileContainerWidth
    } = this.state;
    const maxDesktopContainerWidth = Math.round(
      this.getMaxContainerWidth(containerWidth)
    );
    const maxTabletContainerWidth = Math.round(
      this.getMaxContainerWidth(tabletW, "tablet")
    );
    const maxMobileContainerWidth = Math.round(
      this.getMaxContainerWidth(mobileW, "mobile")
    );

    if (
      maxDesktopContainerWidth > oldMaxDesktopContainerWidth ||
      maxTabletContainerWidth > oldMaxTabletContainerWidth ||
      maxMobileContainerWidth > oldMaxMobileContainerWidth
    ) {
      this.setState({
        maxDesktopContainerWidth,
        maxTabletContainerWidth,
        maxMobileContainerWidth
      });
    }
  }, 2000);

  getMaxContainerWidth = (containerWidth, type = "desktop") => {
    const v = this.getValue();
    const widthStepInPercent = 20;
    const imgSizes = this.getImageSizes(v, containerWidth);

    let shortcodeWidthInPercent;
    let maxDesktopContainerWidth;
    if (this.props.meta.row && this.props.meta.row.itemsLength) {
      const {
        row: { itemsLength },
        desktopW
      } = this.props.meta;

      maxDesktopContainerWidth = desktopW - MIN_COL_WIDTH * (itemsLength - 1);
      shortcodeWidthInPercent =
        (imgSizes[type].width * 100) / maxDesktopContainerWidth;
    } else {
      maxDesktopContainerWidth = containerWidth;
      shortcodeWidthInPercent = (imgSizes[type].width * 100) / containerWidth;
    }

    const maxWidthPercent =
      Math.ceil(shortcodeWidthInPercent / widthStepInPercent) *
      widthStepInPercent;

    return Math.min(
      (maxWidthPercent * maxDesktopContainerWidth) / 100,
      v.imageWidth
    );
  };

  getImageSizes = (v, containerWidth) => {
    const {
      imageWidth,
      imageHeight,
      positionX,
      positionY,
      resize,
      zoom,
      width,
      height
    } = v;
    const { tabletW, mobileW } = this.props.meta;
    const desktopValue = {
      imageWidth,
      imageHeight,
      positionX,
      positionY,
      resize,
      zoom,
      width,
      height
    };
    const tabletValue = {
      imageWidth,
      imageHeight,
      positionX: tabletSyncOnChange(v, "positionX"),
      positionY: tabletSyncOnChange(v, "positionY"),
      resize: tabletSyncOnChange(v, "resize"),
      zoom: tabletSyncOnChange(v, "zoom"),
      width,
      height: tabletSyncOnChange(v, "height")
    };
    const mobileValue = {
      imageWidth,
      imageHeight,
      positionX: mobileSyncOnChange(v, "positionX"),
      positionY: mobileSyncOnChange(v, "positionY"),
      resize: mobileSyncOnChange(v, "resize"),
      zoom: mobileSyncOnChange(v, "zoom"),
      width,
      height: mobileSyncOnChange(v, "height")
    };

    return {
      desktop: calcImageSizes(containerWidth, desktopValue),
      tablet: calcImageSizes(tabletW, tabletValue),
      mobile: calcImageSizes(mobileW, mobileValue)
    };
  };

  getImageUrlsFor(wrapperSizes, device) {
    const v = this.getValue();
    const { desktopW } = this.props.meta;

    const { width: cW, height: cH } = wrapperSizes[device];

    const imageSizes = this.getImageSizes(v, desktopW);
    let { width: iW, height: iH, marginLeft: oX, marginTop: oY } = imageSizes[
      device
    ];

    oX = Math.abs(oX);
    oY = Math.abs(oY);

    const urlFn = v.imagePopulation ? imagePopulationUrl : imageUrl;
    const src = v.imagePopulation ? v.imagePopulation : v.imageSrc;
    const options = v.imagePopulation ? { cW, cH } : { iW, iH, oX, oY, cW, cH };

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

  renderPopups() {
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: itemData => {
        let isGlobal = false;

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          itemData = blocksDataSelector(getStore().getState())[
            itemData.value._id
          ];
          isGlobal = true;
        }

        const {
          blockId,
          value: { popupId }
        } = itemData;

        return {
          blockId,
          instanceKey: IS_EDITOR
            ? `${this.getId()}_${popupId}`
            : isGlobal
            ? `global_${popupId}`
            : popupId
        };
      }
    });

    return <EditorArrayComponent {...popupsProps} />;
  }

  renderForEdit(v) {
    const {
      imageWidth,
      imageHeight,
      imageSrc,
      imageExtension,
      imagePopulation,
      positionX,
      positionY,
      resize,
      zoom,
      width,
      height,
      linkAnchor,
      linkExternalBlank,
      linkExternalRel,
      linkLightBox,
      linkExternalType,
      linkPopup,
      linkUpload,
      popups
    } = v;
    const { tabletW, mobileW, gallery = {} } = this.props.meta;
    const {
      containerWidth,
      maxDesktopContainerWidth,
      maxTabletContainerWidth,
      maxMobileContainerWidth
    } = this.state;

    const imageSizes = this.getImageSizes(v, containerWidth);

    let content;

    if (imagePopulation) {
      content = <Placeholder icon="dynamic-img" />;
    } else if (imageSrc) {
      if (isSVG(imageExtension)) {
        content = (
          <img
            className={imgStyleClassName(v)}
            src={svgUrl(imageSrc)}
            draggable={false}
            loading="lazy"
          />
        );
      } else {
        // Mobile
        const mobileImageOptions = { iW: maxMobileContainerWidth, iH: "any" };
        const mobileImageOptions2X = {
          iW: maxMobileContainerWidth * 2,
          iH: "any"
        };
        const mobileSrcSet = `${imageUrl(
          imageSrc,
          mobileImageOptions
        )} 1x, ${imageUrl(imageSrc, mobileImageOptions2X)} 2x`;

        // Tablet
        const tabletImageOptions = { iW: maxTabletContainerWidth, iH: "any" };
        const tabletImageOptions2X = {
          iW: maxTabletContainerWidth * 2,
          iH: "any"
        };
        const tabletSrcSet = `${imageUrl(
          imageSrc,
          tabletImageOptions
        )} 1x, ${imageUrl(imageSrc, tabletImageOptions2X)} 2x`;

        // Desktop
        const desktopImageOptions = { iW: maxDesktopContainerWidth, iH: "any" };
        const desktopImageOptions2X = {
          iW: maxDesktopContainerWidth * 2,
          iH: "any"
        };
        const desktopSrcSet = `${imageUrl(
          imageSrc,
          desktopImageOptions
        )} 1x, ${imageUrl(imageSrc, desktopImageOptions2X)} 2x`;

        content = (
          <picture className="brz-picture">
            <source srcSet={desktopSrcSet} media="(min-width: 992px)" />
            <source srcSet={tabletSrcSet} media="(min-width: 768px)" />
            <img
              className={imgStyleClassName(v)}
              style={imgStyleCSSVars(v, imageSizes)}
              srcSet={mobileSrcSet}
              src={imageUrl(imageSrc, mobileImageOptions)}
              draggable={false}
              loading="lazy"
            />
          </picture>
        );
      }
    } else {
      content = <Placeholder icon="img" />;
    }

    const linkType = linkLightBox === "on" ? "lightBox" : v.linkType;
    const linkHrefs = {
      anchor: linkAnchor,
      external: v[linkExternalType],
      popup: linkPopup,
      upload: linkUpload,
      lightBox: imagePopulation
        ? imagePopulationUrl(imagePopulation)
        : isSVG(imageExtension)
        ? svgUrl(imageSrc)
        : imageUrl(imageSrc, { iW: 1200, iH: "any" })
    };
    if (linkHrefs[linkType] !== "") {
      content = (
        <Link
          type={linkType}
          href={linkHrefs[linkType]}
          target={linkExternalBlank}
          rel={linkExternalRel}
        >
          {content}
        </Link>
      );
    }

    const desktopValue = {
      imageSrc,
      imageWidth,
      imageHeight,
      positionX,
      positionY,
      resize,
      zoom,
      width,
      height
    };
    const tabletValue = {
      imageSrc,
      imageWidth,
      imageHeight,
      positionX: tabletSyncOnChange(v, "positionX"),
      positionY: tabletSyncOnChange(v, "positionY"),
      resize: tabletSyncOnChange(v, "resize"),
      zoom: tabletSyncOnChange(v, "zoom"),
      width,
      height: tabletSyncOnChange(v, "height")
    };
    const mobileValue = {
      imageSrc,
      imageWidth,
      imageHeight,
      positionX: mobileSyncOnChange(v, "positionX"),
      positionY: mobileSyncOnChange(v, "positionY"),
      resize: mobileSyncOnChange(v, "resize"),
      zoom: mobileSyncOnChange(v, "zoom"),
      width,
      height: mobileSyncOnChange(v, "height")
    };
    const wrapperSizes = {
      desktop: calcWrapperSizes(containerWidth, desktopValue),
      tablet: calcWrapperSizes(tabletW, tabletValue),
      mobile: calcWrapperSizes(mobileW, mobileValue)
    };
    const toolbarConfig = toolbarConfigFn({
      desktopWrapperSizes: wrapperSizes.desktop,
      desktopContainerWidth: containerWidth,
      tabletWrapperSizes: wrapperSizes.tablet,
      tabletContainerWidth: tabletW,
      mobileWrapperSizes: wrapperSizes.mobile,
      mobileContainerWidth: mobileW,
      gallery
    });

    const resizerRestrictions = {
      height: {
        min: getMinHeight(),
        max: Infinity
      },
      size: {
        min: getMinSize(),
        max: getMaxSize()
      }
    };

    let resizerPoints_ = resizerPoints.default;
    if (gallery && gallery.inGallery) {
      resizerPoints_ = resizerPoints.gallery;
    } else if (isSVG(imageExtension)) {
      resizerPoints_ = resizerPoints.svg;
    }

    return (
      <Fragment>
        <div
          ref={this.handleContainerRef}
          className={imageStylesClassName(v, wrapperSizes, this.props)}
          style={imageStylesCSSVars(v)}
        >
          <Toolbar
            {...this.makeToolbarPropsFromConfig(toolbarConfig, sidebarConfig)}
          >
            <CustomCSS selectorName={this.getId()} css={v.customCSS}>
              <div
                className={contentStyleClassName(v)}
                style={contentStyleCSSVars(v, wrapperSizes)}
              >
                <BoxResizer
                  restrictions={resizerRestrictions}
                  points={resizerPoints_}
                  meta={this.props.meta}
                  value={resizerTransformValue(v)}
                  onChange={this.handleBoxResizerChange}
                >
                  <div
                    className={wrapperStyleClassName(v)}
                    style={wrapperStyleCSSVars(v, wrapperSizes)}
                  >
                    {content}
                  </div>
                </BoxResizer>
              </div>
            </CustomCSS>
          </Toolbar>
          {IS_EDITOR && <ResizeAware onResize={this.handleResize} />}
        </div>
        {popups.length > 0 &&
          linkType === "popup" &&
          linkPopup !== "" &&
          this.renderPopups()}
      </Fragment>
    );
  }

  renderForView(v) {
    const {
      imagePopulation,
      imageWidth,
      imageHeight,
      imageExtension,
      imageSrc,
      linkAnchor,
      linkExternalBlank,
      linkExternalRel,
      linkLightBox,
      linkExternalType,
      linkPopup,
      linkUpload,
      popups,
      actionClosePopup
    } = v;

    const { desktopW, tabletW, mobileW } = this.props.meta;

    const wrapperSizes = {
      desktop: calcWrapperSizes(desktopW, v),
      tablet: calcWrapperSizes(tabletW, {
        imageWidth,
        imageHeight,
        resize: tabletSyncOnChange(v, "resize"),
        width: tabletSyncOnChange(v, "width"),
        height: tabletSyncOnChange(v, "height")
      }),
      mobile: calcWrapperSizes(mobileW, {
        imageWidth,
        imageHeight,
        resize: mobileSyncOnChange(v, "resize"),
        width: mobileSyncOnChange(v, "width"),
        height: mobileSyncOnChange(v, "height")
      })
    };

    const { source: sourceSrc, url: desktopSrc } = this.getImageUrlsFor(
      wrapperSizes,
      "desktop"
    );

    const { url: tabletSrc } = this.getImageUrlsFor(wrapperSizes, "tablet");

    const { url: mobileSrc } = this.getImageUrlsFor(wrapperSizes, "mobile");

    let content;
    if (imagePopulation || imageSrc) {
      // this is needed for wp dynamic attributes like alt and title
      const extraImgProps = this.getExtraImageProps
        ? this.getExtraImageProps(v)
        : {};

      if (isSVG(imageExtension) && !imagePopulation) {
        content = (
          <picture className={pictureStyleClassName(wrapperSizes)}>
            {" "}
            <img
              {...extraImgProps}
              className="brz-img brz-p-absolute"
              src={svgUrl(imageSrc)}
              loading="lazy"
            />
          </picture>
        );
      } else {
        content = (
          <picture className={pictureStyleClassName(wrapperSizes)}>
            <source srcSet={desktopSrc} media="(min-width: 992px)" />
            <source srcSet={tabletSrc} media="(min-width: 768px)" />
            <img
              {...extraImgProps}
              className="brz-img brz-p-absolute"
              src={sourceSrc}
              srcSet={mobileSrc}
              loading="lazy"
            />
          </picture>
        );
      }
    } else {
      content = <Placeholder icon="img" />;
    }

    const linkType = linkLightBox === "on" ? "lightBox" : v.linkType;
    const linkHrefs = {
      anchor: linkAnchor,
      external: v[linkExternalType],
      popup: linkPopup,
      upload: linkUpload,
      lightBox: imagePopulation
        ? imagePopulationUrl(imagePopulation)
        : isSVG(imageExtension)
        ? svgUrl(imageSrc)
        : imageUrl(imageSrc, { iW: 1200, iH: "any" })
    };
    if (linkHrefs[linkType] !== "") {
      const className = classnames({
        "brz-popup2__action-close":
          linkType === "action" && actionClosePopup === "on"
      });

      content = (
        <Link
          type={linkType}
          href={linkHrefs[linkType]}
          target={linkExternalBlank}
          rel={linkExternalRel}
          className={className}
        >
          {content}
        </Link>
      );
    }

    return (
      <Fragment>
        <div className={imageStylesClassName(v, wrapperSizes, this.props)}>
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            {content}
          </CustomCSS>
        </div>
        {popups.length > 0 &&
          linkType === "popup" &&
          linkPopup !== "" &&
          this.renderPopups()}
      </Fragment>
    );
  }
}

export default Image;
