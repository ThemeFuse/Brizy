import React from "react";
import _ from "underscore";
import classnames from "classnames";
import { css } from "glamor";
import EditorComponent from "visual/editorComponents/EditorComponent";
import SortableElement from "visual/component-new/Sortable/SortableElement";
import Background from "visual/component-new/Background";
import ContainerBorder from "visual/component-new/ContainerBorder";
import FloatingButton from "visual/component-new/FloatingButton";
import SortableHandle from "visual/component-new/Sortable/SortableHandle";
import Animation from "visual/component-new/Animation";
import Toolbar from "visual/component-new/Toolbar";
import { Roles } from "visual/component-new/Roles";
import { hexToRgba } from "visual/utils/color";
import { wInMobilePage, minWinColumn } from "visual/config/columns";
import ColumnResizer from "./components/ColumnResizer";
import { percentageToPixels } from "visual/utils/meta";
import Items from "./Items";
import * as toolbarConfig from "./toolbar";
import {
  bgStyleClassName,
  bgStyleCSSVars,
  styleClassName,
  styleCSSVars
} from "./styles";
import defaultValue from "./defaultValue.json";

class Column extends EditorComponent {
  static get componentId() {
    return "Column";
  }

  static defaultProps = {
    meta: {},
    popoverData: [],
    onResize: _.noop,
    onResizeEnd: _.noop
  };

  static defaultValue = defaultValue;

  shouldComponentUpdate(nextProps) {
    return this.optionalSCU(nextProps);
  }

  handleToolbarOpen = () => {
    if (this.containerBorder) {
      this.containerBorder.setActive(true);
    }
    if (this.floatingButton) {
      this.floatingButton.setActive(true);
    }
  };

  handleToolbarClose = () => {
    if (this.containerBorder) {
      this.containerBorder.setActive(false);
    }
    if (this.floatingButton) {
      this.floatingButton.setActive(false);
    }
  };

  handleToolbarEnter = () => {
    if (this.containerBorder) {
      this.containerBorder.setParentsHover(true);
    }
  };

  handleToolbarLeave = () => {
    if (this.containerBorder) {
      this.containerBorder.setParentsHover(false);
    }
  };

  getMeta(v) {
    const { meta } = this.props;
    const {
      width: columnWidth,

      // Margin
      marginType,
      margin,
      marginSuffix,
      marginLeft,
      marginLeftSuffix,
      marginRight,
      marginRightSuffix,

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

      // Mobile margin
      mobileMargin,
      mobileMarginType,
      mobileMarginSuffix,
      mobileMarginLeft,
      mobileMarginLeftSuffix,
      mobileMarginRight,
      mobileMarginRightSuffix
    } = v;

    let wInMobileCol = meta.mobileW;
    if (meta.row.isInner && meta.desktopW <= wInMobilePage) {
      wInMobileCol = meta.mobileW * (columnWidth / 100);
    }
    const wInDesktopCol = meta.desktopW * (columnWidth / 100);

    const marginW =
      marginType === "grouped"
        ? percentageToPixels(margin * 2, marginSuffix, wInDesktopCol)
        : percentageToPixels(marginLeft, marginLeftSuffix, wInDesktopCol) +
          percentageToPixels(marginRight, marginRightSuffix, wInDesktopCol);
    const paddingW =
      paddingType === "grouped"
        ? percentageToPixels(padding * 2, paddingSuffix, wInDesktopCol)
        : percentageToPixels(paddingLeft, paddingLeftSuffix, wInDesktopCol) +
          percentageToPixels(paddingRight, paddingRightSuffix, wInDesktopCol);
    const borderWidthW =
      borderWidthType === "grouped"
        ? Number(borderWidth) * 2
        : Number(borderLeftWidth) + Number(borderRightWidth);

    const mobilePaddingW =
      mobilePaddingType === "grouped"
        ? percentageToPixels(
            mobilePadding * 2,
            mobilePaddingSuffix,
            wInMobileCol
          )
        : percentageToPixels(
            mobilePaddingLeft,
            mobilePaddingLeftSuffix,
            wInMobileCol
          ) +
          percentageToPixels(
            mobilePaddingRight,
            mobilePaddingRightSuffix,
            wInMobileCol
          );
    const mobileMarginW =
      mobileMarginType === "grouped"
        ? percentageToPixels(mobileMargin * 2, mobileMarginSuffix, wInMobileCol)
        : percentageToPixels(
            mobileMarginLeft,
            mobileMarginLeftSuffix,
            wInMobileCol
          ) +
          percentageToPixels(
            mobileMarginRight,
            mobileMarginRightSuffix,
            wInMobileCol
          );

    const externalSpacing = marginW + paddingW + borderWidthW;
    const externalMobileSpacing = mobileMarginW + mobilePaddingW + borderWidthW;

    let mobileW = Math.round((wInMobileCol - externalMobileSpacing) * 10) / 10;
    const desktopW = Math.round((wInDesktopCol - externalSpacing) * 10) / 10;

    if (IS_PREVIEW && desktopW >= minWinColumn) {
      mobileW = Math.round((minWinColumn - externalMobileSpacing) * 10) / 10;
    }

    return _.extend({}, meta, {
      column: {
        width: columnWidth
      },
      mobileW,
      desktopW
    });
  }

  renderToolbar(v) {
    const { row } = this.props.meta;
    const isInnerRow = row.isInner;

    return (
      <div className="brz-ed-column__toolbar">
        <Toolbar
          {...this.makeToolbarPropsFromConfig(toolbarConfig)}
          onOpen={this.handleToolbarOpen}
          onClose={this.handleToolbarClose}
          onMouseEnter={this.handleToolbarEnter}
          onMouseLeave={this.handleToolbarLeave}
        >
          <SortableHandle>
            <div>
              <FloatingButton
                ref={el => {
                  this.floatingButton = el;
                }}
                reactToClick={false}
                color={isInnerRow ? "red" : "blue"}
              />
            </div>
          </SortableHandle>
        </Toolbar>
      </div>
    );
  }

  renderResizer = position => {
    const {
      meta: {
        row: {
          isInner: isInnerRow,
          item: { isFirst, isLast }
        }
      },
      popoverData,
      onResize,
      onResizeEnd
    } = this.props;

    if ((isFirst && position === "left") || (isLast && position === "right")) {
      return null;
    }

    return (
      <ColumnResizer
        popoverData={popoverData}
        position={position}
        color={isInnerRow ? "red" : "blue"}
        onResize={({ deltaX }) => onResize(position, deltaX)}
        onResizeEnd={onResizeEnd}
      />
    );
  };

  renderContent(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.bgColorPalette && `${_v.bgColorPalette}__bg`,
      _v.borderColorPalette && `${_v.borderColorPalette}__border`,
      _v.boxShadowColorPalette && `${_v.boxShadowColorPalette}__boxShadow`,
      _v.mobileBgColorPalette && `${_v.mobileBgColorPalette}__mobileBg`
    ]);

    const {
      bgImageSrc,
      bgColorOpacity,
      mobileBgImageSrc,
      mobileBgColorOpacity
    } = v;

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      containerClassName: "brz-column__items",
      meta: this.getMeta(v)
    });

    const bgProps = {
      className: bgStyleClassName(v, this.props),
      imageSrc: bgImageSrc,
      colorOpacity: bgColorOpacity,
      mobileImageSrc: mobileBgImageSrc,
      mobileColorOpacity: mobileBgColorOpacity
    };

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

    const { animationName, animationDuration, animationDelay, items } = v;
    const {
      meta: { row },
      path
    } = this.props;
    const isInnerRow = row.isInner;
    const styles = {
      ...bgStyleCSSVars(v, this.props),
      ...styleCSSVars(v, this.props)
    };

    const borderClassName = classnames("brz-ed-border__column", {
      "brz-ed-border__column--empty": items.length == 0
    });

    return (
      <SortableElement type="column" useHandle={true}>
        <Animation
          className={styleClassName(v, this.props)}
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
              className={borderClassName}
              borderColor={isInnerRow ? "red" : "blue"}
              borderStyle="solid"
              reactToClick={false}
              path={path}
            >
              {this.renderResizer("left")}
              {this.renderResizer("right")}
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
        className={styleClassName(v, this.props)}
        name={animationName !== "none" && animationName}
        duration={animationDuration}
        delay={animationDelay}
      >
        {this.renderContent(v)}
      </Animation>
    );
  }
}

export default Column;
