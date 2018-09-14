import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import SortableElement from "visual/component-new/Sortable/SortableElement";
import SortableHandle from "visual/component-new/Sortable/SortableHandle";
import ContainerBorder from "visual/component-new/ContainerBorder";
import FloatingButton from "visual/component-new/FloatingButton";
import Background from "visual/component-new/Background";
import Animation from "visual/component-new/Animation";
import Toolbar from "visual/component-new/Toolbar";
import { Roles } from "visual/component-new/Roles";
import { videoData as getVideoData } from "visual/utils/video";
import { percentageToPixels } from "visual/utils/meta";
import Items from "./Items";
import * as toolbarConfig from "./toolbar";
import {
  bgStyleClassName,
  bgStyleCSSVars,
  containerStyleClassName,
  containerStyleCSSVars
} from "./styles";
import defaultValue from "./defaultValue.json";

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
    const externalMobileSpacing = mobilePaddingW + borderWidthW;

    const desktopW = Math.round((containerWidth - externalSpacing) * 10) / 10;
    const mobileW =
      Math.round((meta.mobileW - externalMobileSpacing) * 10) / 10;

    return Object.assign({}, meta, {
      row: {
        isInner: this.isInnerRow(),
        itemsLength: items.length
      },
      mobileW,
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
      _v.borderColorPalette && `${_v.borderColorPalette}__border`,
      _v.boxShadowColorPalette && `${_v.boxShadowColorPalette}__boxShadow`,
      _v.mobileBgColorPalette && `${_v.mobileBgColorPalette}__mobileBg`
    ]);

    const {
      media,
      bgImageSrc,
      bgColorOpacity,
      bgVideo,
      bgMapZoom,
      bgMapAddress,
      mobileMedia,
      mobileBgImageSrc,
      mobileBgColorOpacity,
      mobileBgMapZoom
    } = v;

    let bgProps = {
      className: bgStyleClassName(v),
      imageSrc: bgImageSrc,
      colorOpacity: bgColorOpacity,
      mobileImageSrc: mobileBgImageSrc,
      mobileColorOpacity: mobileBgColorOpacity
    };

    if (media === "video") {
      bgProps.video = getVideoData(bgVideo);
    }

    if (media === "map" || mobileMedia === "map") {
      bgProps.mapAddress = bgMapAddress;
      bgProps.mapZoom = bgMapZoom;
    }

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      containerClassName: containerStyleClassName(v, this.isInnerRow()),
      meta: this.getMeta(v)
    });

    return (
      <Background {...bgProps}>
        <Items {...itemsProps} />
      </Background>
    );
  }

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.bgColorPalette && `${_v.bgColorPalette}__bg`,
      _v.borderColorPalette && `${_v.borderColorPalette}__border`,
      _v.boxShadowColorPalette && `${_v.boxShadowColorPalette}__boxShadow`,
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
