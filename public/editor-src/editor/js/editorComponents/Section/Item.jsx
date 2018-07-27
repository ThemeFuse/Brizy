import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import SectionItemItems from "./ItemItems";
import Background from "visual/component-new/Background";
import ContainerBorder from "visual/component-new/ContainerBorder";
import PaddingResizer from "visual/component-new/PaddingResizer";
import { Roles } from "visual/component-new/Roles";
import { videoData as getVideoData } from "visual/utils/video";
import {
  wInBoxedPage,
  wInMobilePage,
  wInFullPage
} from "visual/config/columns";
import { CollapsibleToolbar } from "visual/component-new/Toolbar";
import * as toolbarConfig from "./toolbar";
import {
  bgStyleClassName,
  bgStyleCSSVars,
  itemsStyleClassName,
  itemsStyleCSSVars,
  containerStyleClassName,
  containerStyleCSSVars,
  contentStyleClassName
} from "./styles";
import defaultValue from "./itemDefaultValue.json";
import { getStore } from "visual/redux/store";

class SectionItem extends EditorComponent {
  static get componentId() {
    return "SectionItem";
  }

  static defaultProps = {
    meta: {},
    showSlider: false
  };

  static defaultValue = defaultValue;

  shouldComponentUpdate(nextProps) {
    const {
      showSlider,
      meta: {
        section: { showOnMobile }
      }
    } = this.props;
    const {
      meta: {
        section: { showOnMobile: newShowOnMobile }
      }
    } = nextProps;
    const { deviceMode } = getStore().getState().ui;
    const deviceUpdate =
      deviceMode === "mobile" && showOnMobile !== newShowOnMobile;

    return showSlider || deviceUpdate || this.optionalSCU(nextProps);
  }

  handleToolbarOpen = () => {
    if (this.containerBorder) {
      this.containerBorder.setActive(true);
    }
  };
  handleToolbarClose = () => {
    if (this.containerBorder) {
      this.containerBorder.setActive(false);
    }
  };

  handlePaddingResizerChange = patch => this.patchValue(patch);

  getMeta(v) {
    const { meta } = this.props;
    const {
      containerSize,
      containerType,
      borderWidthType,
      borderWidth,
      borderLeftWidth,
      borderRightWidth
    } = v;

    const borderWidthW =
      borderWidthType === "grouped"
        ? Number(borderWidth) * 2
        : Number(borderLeftWidth) + Number(borderRightWidth);

    const desktopW =
      containerType === "fullWidth"
        ? wInFullPage - borderWidthW
        : Math.round(
            (wInBoxedPage - borderWidthW) * (containerSize / 100) * 10
          ) / 10;

    const mobileW = wInMobilePage - borderWidthW - 30; // 30 px is padding default for iframe

    return {
      ...meta,
      mobileW,
      desktopW
    };
  }

  renderToolbar(_v) {
    const { globalBlockId } = this.props.meta;

    return (
      <CollapsibleToolbar
        {...this.makeToolbarPropsFromConfig(toolbarConfig)}
        className="brz-ed-collapsible__section brz-ed-collapsible--big"
        animation="rightToLeft"
        badge={Boolean(globalBlockId)}
        onOpen={this.handleToolbarOpen}
        onClose={this.handleToolbarClose}
      />
    );
  }

  renderItems(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.bgColorPalette && `${_v.bgColorPalette}__bg`,
      _v.borderColorPalette && `${_v.borderColorPalette}__border`,
      _v.mobileBgColorPalette && `${_v.mobileBgColorPalette}__mobileBg`
    ]);

    const {
      media,
      bgImageSrc,
      bgColorOpacity,
      bgAttachment,
      bgVideo,
      bgVideoLoop,
      bgVideoQuality,
      bgMapZoom,
      bgMapAddress,
      mobileMedia,
      mobileBgImageSrc,
      mobileBgColorOpacity,
      mobileBgAttachment
    } = v;

    const meta = this.getMeta(v);

    let bgProps = {
      className: bgStyleClassName(v, this.props),
      imageSrc: bgImageSrc,
      colorOpacity: bgColorOpacity,
      parallax: bgAttachment === "animated" && !meta.showSlider,
      mobileImageSrc: mobileBgImageSrc,
      mobileColorOpacity: mobileBgColorOpacity
    };

    if (media === "video") {
      bgProps.video = getVideoData(bgVideo);
      bgProps.bgVideoQuality = bgVideoQuality;
      bgProps.bgVideoLoop = bgVideoLoop === "on";
    }

    if (media === "map" || mobileMedia === "map") {
      bgProps.mapAddress = bgMapAddress;
      bgProps.mapZoom = bgMapZoom;
    }

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      className: itemsStyleClassName(v),
      meta
    });

    return (
      <Background {...bgProps}>
        <PaddingResizer value={v} onChange={this.handlePaddingResizerChange}>
          <div className={containerStyleClassName(v)}>
            <SectionItemItems {...itemsProps} />
          </div>
        </PaddingResizer>
      </Background>
    );
  }

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.bgColorPalette && `${_v.bgColorPalette}__bg`,
      _v.borderColorPalette && `${_v.borderColorPalette}__border`,
      _v.mobileBgColorPalette && `${_v.mobileBgColorPalette}__mobileBg`
    ]);

    const styles = {
      ...bgStyleCSSVars(v, this.props),
      ...itemsStyleCSSVars(v),
      ...containerStyleCSSVars(v)
    };

    return (
      <div className={contentStyleClassName(v)} style={styles}>
        <Roles allow={["admin"]} fallbackRender={() => this.renderItems(v)}>
          <ContainerBorder
            ref={el => {
              this.containerBorder = el;
            }}
            borderStyle="none"
            activeBorderStyle="none"
            reactToClick={false}
            showBorders={false}
            path={this.getPath()}
          >
            {this.renderToolbar(v)}
            {this.renderItems(v)}
          </ContainerBorder>
        </Roles>
      </div>
    );
  }

  renderForView(v) {
    return (
      <div className={contentStyleClassName(v)}>{this.renderItems(v)}</div>
    );
  }
}

export default SectionItem;
