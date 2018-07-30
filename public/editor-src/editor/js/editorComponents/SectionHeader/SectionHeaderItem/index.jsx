import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Background from "visual/component-new/Background";
import ContainerBorder from "visual/component-new/ContainerBorder";
import PaddingResizer from "visual/component-new/PaddingResizer";
import SectionHeaderItemItems from "./items";
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
  containerStyleCSSVars
} from "./styles";
import defaultValue from "./defaultValue.json";

class SectionHeaderItem extends EditorComponent {
  static get componentId() {
    return "SectionHeaderItem";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  shouldComponentUpdate(nextProps) {
    return this.optionalSCU(nextProps);
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

    const mobileW = wInMobilePage - borderWidthW;

    return {
      ...meta,
      mobileW,
      desktopW
    };
  }

  getSectionClassName(v) {
    const { className } = v;

    return classnames("brz-section__menu-item", className);
  }

  renderToolbar() {
    return (
      <CollapsibleToolbar
        {...this.makeToolbarPropsFromConfig(toolbarConfig)}
        className="brz-ed-collapsible__section brz-ed-collapsible--big"
        animation="rightToLeft"
        onOpen={this.handleToolbarOpen}
        onClose={this.handleToolbarClose}
      />
    );
  }

  renderItems(v) {
    const {
      bgImageSrc,
      bgColorOpacity,
      mobileBgImageSrc,
      mobileBgColorOpacity
    } = v;

    const meta = this.getMeta(v);

    let bgProps = {
      className: bgStyleClassName(v, this.props),
      imageSrc: bgImageSrc,
      colorOpacity: bgColorOpacity,
      mobileImageSrc: mobileBgImageSrc,
      mobileColorOpacity: mobileBgColorOpacity
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
      _v.borderColorPalette && `${_v.borderColorPalette}__border`,
      _v.mobileBgColorPalette && `${_v.mobileBgColorPalette}__mobileBg`
    ]);

    const styles = {
      ...bgStyleCSSVars(v, this.props),
      ...itemsStyleCSSVars(v),
      ...containerStyleCSSVars(v)
    };

    return (
      <div className={this.getSectionClassName(v)} style={styles}>
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
      </div>
    );
  }

  renderForView(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.bgColorPalette && `${_v.bgColorPalette}__bg`,
      _v.borderColorPalette && `${_v.borderColorPalette}__border`,
      _v.mobileBgColorPalette && `${_v.mobileBgColorPalette}__mobileBg`
    ]);

    return (
      <div className={this.getSectionClassName(v)}>{this.renderItems(v)}</div>
    );
  }
}

export default SectionHeaderItem;
