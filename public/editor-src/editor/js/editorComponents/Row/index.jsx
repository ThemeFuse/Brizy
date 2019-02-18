import React from "react";
import _ from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import SortableElement from "visual/component/Sortable/SortableElement";
import SortableHandle from "visual/component/Sortable/SortableHandle";
import ContainerBorder from "visual/component/ContainerBorder";
import FloatingButton from "visual/component/FloatingButton";
import Background from "visual/component/Background";
import Animation from "visual/component/Animation";
import { Roles } from "visual/component/Roles";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import ContextMenu from "visual/component/ContextMenu";
import contextMenuConfig from "./contextMenu";
import { videoData as getVideoData } from "visual/utils/video";
import { percentageToPixels } from "visual/utils/meta";
import Items from "./Items";
import {
  bgStyleClassName,
  bgStyleCSSVars,
  containerStyleClassName,
  containerStyleCSSVars
} from "./styles";
import defaultValue from "./defaultValue.json";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

class Row extends EditorComponent {
  static get componentId() {
    return "Row";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  shouldComponentUpdate(nextProps) {
    return this.optionalSCU(nextProps);
  }

  handleValueChange(value, meta) {
    const inPopup = Boolean(this.props.meta.sectionPopup);

    if (value.items.length === 0 && !inPopup) {
      this.selfDestruct();
    } else {
      super.handleValueChange(value, meta);
    }
  }

  handleToolbarOpen = () => {
    this.containerBorder.setActive(true);
    this.floatingButton.setActive(true);
  };

  handleToolbarClose = () => {
    this.containerBorder.setActive(false);
    this.floatingButton.setActive(false);

    this.patchValue({ tabsState: "tabNormal" });
    this.patchValue({ tabsCurrentElement: "tabCurrentElement" });
    this.patchValue({ tabsColor: "tabOverlay" });
  };

  handleToolbarEnter = () => {
    this.containerBorder.setParentsHover(true);
  };

  handleToolbarLeave = () => {
    this.containerBorder.setParentsHover(false);
  };

  handleButtonEnter = () => {
    this.containerBorder.setShowBorder(true);
  };

  handleButtonLeave = () => {
    this.containerBorder.setShowBorder(false);
  };

  getMeta(v) {
    const { meta } = this.props;
    const {
      size,

      // Padding
      paddingType,
      padding,
      paddingSuffix,
      paddingLeft,
      paddingLeftSuffix,
      paddingRight,
      paddingRightSuffix,

      // Border
      borderWidthType,
      borderWidth,
      borderLeftWidth,
      borderRightWidth,

      // Tablet Padding
      tabletPadding,
      tabletPaddingType,
      tabletPaddingSuffix,
      tabletPaddingLeft,
      tabletPaddingLeftSuffix,
      tabletPaddingRight,
      tabletPaddingRightSuffix,

      // Mobile Padding
      mobilePadding,
      mobilePaddingType,
      mobilePaddingSuffix,
      mobilePaddingLeft,
      mobilePaddingLeftSuffix,
      mobilePaddingRight,
      mobilePaddingRightSuffix,

      items
    } = v;

    const containerWidth = meta.desktopW * (size / 100);
    const paddingW =
      paddingType === "grouped"
        ? percentageToPixels(padding * 2, paddingSuffix, containerWidth)
        : percentageToPixels(paddingLeft, paddingLeftSuffix, containerWidth) +
          percentageToPixels(paddingRight, paddingRightSuffix, containerWidth);
    const borderWidthW =
      borderWidthType === "grouped"
        ? Number(borderWidth) * 2
        : Number(borderLeftWidth) + Number(borderRightWidth);

    // Tablet Padding
    const tabletPaddingW =
      tabletPaddingType === "grouped"
        ? percentageToPixels(
            tabletPadding * 2,
            tabletPaddingSuffix,
            meta.tabletW
          )
        : percentageToPixels(
            tabletPaddingLeft,
            tabletPaddingLeftSuffix,
            meta.tabletW
          ) +
          percentageToPixels(
            tabletPaddingRight,
            tabletPaddingRightSuffix,
            meta.tabletW
          );

    // Mobile Padding
    const mobilePaddingW =
      mobilePaddingType === "grouped"
        ? percentageToPixels(
            mobilePadding * 2,
            mobilePaddingSuffix,
            meta.mobileW
          )
        : percentageToPixels(
            mobilePaddingLeft,
            mobilePaddingLeftSuffix,
            meta.mobileW
          ) +
          percentageToPixels(
            mobilePaddingRight,
            mobilePaddingRightSuffix,
            meta.mobileW
          );

    const externalSpacing = paddingW + borderWidthW;
    const externalTabletSpacing = tabletPaddingW + borderWidthW;
    const externalMobileSpacing = mobilePaddingW + borderWidthW;

    const desktopW = Math.round((containerWidth - externalSpacing) * 10) / 10;
    const tabletW =
      Math.round((meta.tabletW - externalTabletSpacing) * 10) / 10;
    const mobileW =
      Math.round((meta.mobileW - externalMobileSpacing) * 10) / 10;

    return Object.assign({}, meta, {
      row: {
        isInner: this.isInnerRow(),
        itemsLength: items.length
      },
      inGrid: true,
      mobileW,
      tabletW,
      desktopW
    });
  }

  isInnerRow() {
    const { meta } = this.props;

    return meta.row !== undefined;
  }

  renderToolbar() {
    return (
      <div className="brz-ed-row__toolbar">
        <Toolbar
          {...this.makeToolbarPropsFromConfig(toolbarConfig)}
          onOpen={this.handleToolbarOpen}
          onClose={this.handleToolbarClose}
          onMouseEnter={this.handleToolbarEnter}
          onMouseLeave={this.handleToolbarLeave}
        >
          <SortableHandle>
            <div
              onMouseEnter={this.handleButtonEnter}
              onMouseLeave={this.handleButtonLeave}
            >
              <FloatingButton
                reactToClick={false}
                ref={el => {
                  this.floatingButton = el;
                }}
              />
            </div>
          </SortableHandle>
        </Toolbar>
      </div>
    );
  }

  renderContent(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.bgColorPalette && `${_v.bgColorPalette}__bg`,
      _v.hoverBgColorPalette && `${_v.hoverBgColorPalette}__hoverBg`,

      _v.gradientColorPalette && `${_v.gradientColorPalette}__gradient`,
      _v.hoverGradientColorPalette &&
        `${_v.hoverGradientColorPalette}__hoverGradient`,

      _v.borderColorPalette && `${_v.borderColorPalette}__border`,
      _v.hoverBorderColorPalette &&
        `${_v.hoverBorderColorPalette}__hoverBorder`,

      _v.boxShadowColorPalette && `${_v.boxShadowColorPalette}__boxShadow`,
      _v.tabletBgColorPalette && `${_v.tabletBgColorPalette}__tabletBg`,
      _v.mobileBgColorPalette && `${_v.mobileBgColorPalette}__mobileBg`
    ]);

    const {
      media,
      bgImageSrc,
      bgColorOpacity,
      bgVideo,
      bgMapZoom,
      bgMapAddress
    } = v;

    let bgProps = {
      className: bgStyleClassName(v),
      imageSrc: bgImageSrc,
      colorOpacity: bgColorOpacity,
      tabletImageSrc: tabletSyncOnChange(v, "bgImageSrc"),
      tabletColorOpacity: tabletSyncOnChange(v, "bgColorOpacity"),
      mobileImageSrc: mobileSyncOnChange(v, "bgImageSrc"),
      mobileColorOpacity: mobileSyncOnChange(v, "bgColorOpacity")
    };

    if (media === "video") {
      bgProps.video = getVideoData(bgVideo);
    }

    if (
      media === "map" ||
      mobileSyncOnChange(v, "media") === "map" ||
      tabletSyncOnChange(v, "media") === "map"
    ) {
      bgProps.mapAddress = bgMapAddress;
      bgProps.mapZoom = bgMapZoom;
    }

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      containerClassName: containerStyleClassName(v, this.isInnerRow()),
      meta: this.getMeta(v)
    });

    return (
      <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
        <Background {...bgProps}>
          <Items {...itemsProps} />
        </Background>
      </ContextMenu>
    );
  }

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.bgColorPalette && `${_v.bgColorPalette}__bg`,
      _v.hoverBgColorPalette && `${_v.hoverBgColorPalette}__hoverBg`,

      _v.gradientColorPalette && `${_v.gradientColorPalette}__gradient`,
      _v.hoverGradientColorPalette &&
        `${_v.hoverGradientColorPalette}__hoverGradient`,

      _v.borderColorPalette && `${_v.borderColorPalette}__border`,
      _v.hoverBorderColorPalette &&
        `${_v.hoverBorderColorPalette}__hoverBorder`,

      _v.boxShadowColorPalette && `${_v.boxShadowColorPalette}__boxShadow`,
      _v.tabletBgColorPalette && `${_v.tabletBgColorPalette}__tabletBg`,
      _v.mobileBgColorPalette && `${_v.mobileBgColorPalette}__mobileBg`
    ]);

    const isInnerRow = this.isInnerRow();
    const { showToolbar, animationName, animationDuration, animationDelay } = v;
    const styles = {
      ...bgStyleCSSVars(v),
      ...containerStyleCSSVars(v, isInnerRow)
    };

    if (showToolbar === "off") {
      return (
        <SortableElement type="row" useHandle={true}>
          <Animation
            className="brz-row__container"
            style={styles}
            name={animationName !== "none" && animationName}
            duration={animationDuration}
            delay={animationDelay}
          >
            {this.renderContent(v)}
          </Animation>
        </SortableElement>
      );
    }

    return (
      <SortableElement type="row" useHandle={true}>
        <Animation
          className="brz-row__container"
          style={styles}
          name={animationName !== "none" && animationName}
          duration={animationDuration}
          delay={animationDelay}
        >
          <Roles allow={["admin"]} fallbackRender={() => this.renderContent(v)}>
            <ContainerBorder
              ref={input => {
                this.containerBorder = input;
              }}
              className="brz-ed-border__row"
              borderStyle="none"
              activeBorderStyle="dotted"
              showBorders={false}
              reactToClick={false}
              path={this.props.path}
            >
              {this.renderToolbar(v)}
              {this.renderContent(v)}
            </ContainerBorder>
          </Roles>
        </Animation>
      </SortableElement>
    );
  }

  renderForView(v) {
    const { animationName, animationDuration, animationDelay } = v;

    return (
      <Animation
        className="brz-row__container"
        name={animationName !== "none" && animationName}
        duration={animationDuration}
        delay={animationDelay}
      >
        {this.renderContent(v)}
      </Animation>
    );
  }
}

export default Row;
