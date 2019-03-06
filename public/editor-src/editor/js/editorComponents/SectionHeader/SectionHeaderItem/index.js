import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import Background from "visual/component/Background";
import ContainerBorder from "visual/component/ContainerBorder";
import PaddingResizer from "visual/component/PaddingResizer";
import { Roles } from "visual/component/Roles";
import SectionHeaderItemItems from "./items";
import {
  wInBoxedPage,
  wInTabletPage,
  wInMobilePage,
  wInFullPage
} from "visual/config/columns";
import { CollapsibleToolbar } from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import {
  bgStyleClassName,
  bgStyleCSSVars,
  itemsStyleClassName,
  itemsStyleCSSVars,
  containerStyleClassName,
  containerStyleCSSVars
} from "./styles";
import defaultValue from "./defaultValue.json";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

class SectionHeaderItem extends EditorComponent {
  static get componentId() {
    return "SectionHeaderItem";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  mounted = false;

  componentDidMount() {
    this.mounted = true;
  }

  shouldComponentUpdate(nextProps) {
    return this.optionalSCU(nextProps);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleToolbarOpen = () => {
    if (this.containerBorder) {
      this.containerBorder.setActive(true);
    }
  };

  handleToolbarClose = () => {
    if (!this.mounted) {
      return;
    }

    if (this.containerBorder) {
      this.containerBorder.setActive(false);
    }

    this.patchValue({
      tabsState: "tabNormal",
      tabsCurrentElement: "tabCurrentElement",
      tabsColor: "tabOverlay"
    });
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

    const tabletW = wInTabletPage - borderWidthW;
    const mobileW = wInMobilePage - borderWidthW;

    return {
      ...meta,
      mobileW,
      tabletW,
      desktopW
    };
  }

  getSectionClassName(v) {
    const { className } = v;

    return classnames("brz-section__menu-item", className);
  }

  renderToolbar() {
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

  renderItems(v) {
    const {
      bgImageSrc,
      bgColorOpacity,
      bgPopulation,
      shapeTopType,
      shapeBottomType
    } = v;

    const meta = this.getMeta(v);

    let bgProps = {
      className: bgStyleClassName(v, this.props),
      imageSrc: bgImageSrc || bgPopulation,
      colorOpacity: bgColorOpacity,
      shapeTopType: shapeTopType !== "none" && shapeTopType,
      shapeBottomType: shapeBottomType !== "none" && shapeBottomType,
      tabletImageSrc: tabletSyncOnChange(v, "bgImageSrc"),
      tabletColorOpacity: tabletSyncOnChange(v, "bgColorOpacity"),
      mobileImageSrc: mobileSyncOnChange(v, "bgImageSrc"),
      mobileColorOpacity: mobileSyncOnChange(v, "bgColorOpacity")
    };

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      className: itemsStyleClassName(v),
      meta
    });

    return (
      <Background {...bgProps}>
        <PaddingResizer value={v} onChange={this.handlePaddingResizerChange}>
          <div className={containerStyleClassName(v)}>
            <SectionHeaderItemItems {...itemsProps} />
          </div>
        </PaddingResizer>
      </Background>
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

      _v.shapeTopColorPalette && `${_v.shapeTopColorPalette}__shapeTopColor`,
      _v.shapeBottomColorPalette &&
        `${_v.shapeBottomColorPalette}__shapeBottomColor`,

      _v.tabletBgColorPalette && `${_v.tabletBgColorPalette}__tabletBg`,
      _v.tabletBorderColorPalette &&
        `${_v.tabletBorderColorPalette}__tabletBorder`,

      _v.mobileBgColorPalette && `${_v.mobileBgColorPalette}__mobileBg`,
      _v.mobileBorderColorPalette &&
        `${_v.mobileBorderColorPalette}__mobileBorder`
    ]);

    const styles = {
      ...bgStyleCSSVars(v, this.props),
      ...itemsStyleCSSVars(v),
      ...containerStyleCSSVars(v)
    };

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={this.getSectionClassName(v)} style={styles}>
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
      </CustomCSS>
    );
  }

  renderForView(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.bgColorPalette && `${_v.bgColorPalette}__bg`,
      _v.hoverBgColorPalette && `${_v.hoverBgColorPalette}__hoverBg`,

      _v.gradientColorPalette && `${_v.gradientColorPalette}__gradient`,
      _v.hoverGradientColorPalette &&
        `${_v.hoverGradientColorPalette}__hoverGradient`,

      _v.borderColorPalette && `${_v.borderColorPalette}__border`,
      _v.hoverBorderColorPalette &&
        `${_v.hoverBorderColorPalette}__hoverBorder`,

      _v.shapeTopColorPalette && `${_v.shapeTopColorPalette}__shapeTopColor`,
      _v.shapeBottomColorPalette &&
        `${_v.shapeBottomColorPalette}__shapeBottomColor`,
        
      _v.tabletBgColorPalette && `${_v.tabletBgColorPalette}__tabletBg`,
      _v.tabletBorderColorPalette &&
        `${_v.tabletBorderColorPalette}__tabletBorder`,

      _v.mobileBgColorPalette && `${_v.mobileBgColorPalette}__mobileBg`,
      _v.mobileBorderColorPalette &&
        `${_v.mobileBorderColorPalette}__mobileBorder`
    ]);

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={this.getSectionClassName(v)}>{this.renderItems(v)}</div>
      </CustomCSS>
    );
  }
}

export default SectionHeaderItem;
