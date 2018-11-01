import React from "react";
import _ from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import ContainerBorder from "visual/component-new/ContainerBorder";
import Animation from "visual/component-new/Animation";
import { percentageToPixels } from "visual/utils/meta";
import Items from "./items";
import * as toolbarExtendConfig from "./extendToolbar";
import {
  styleClassName,
  wrapStyleClassName,
  wrapStyleCSSVars,
  containerStyleClassName,
  containerStyleCSSVars,
  itemsStyleClassName,
  itemsStyleCSSVars
} from "./styles";
import defaultValue from "./defaultValue.json";

class Cloneable extends EditorComponent {
  static get componentId() {
    return "Cloneable";
  }

  static defaultProps = {
    className: "",
    showBorder: true,
    meta: {}
  };

  static defaultValue = defaultValue;

  handleValueChange(value, meta) {
    if (value.items.length === 0) {
      this.selfDestruct();
    } else {
      super.handleValueChange(value, meta);
    }
  }

  handleToolbarEnter = () => {
    this.containerBorder.setParentsHover(true);
  };

  handleToolbarLeave = () => {
    this.containerBorder.setParentsHover(false);
  };

  handleSortableStart = () => {
    this.containerBorder.setActive(true);
  };

  handleSortableEnd = () => {
    if (this.containerBorder) {
      this.containerBorder.setActive(false);
    }
  };

  getMeta(v) {
    const { meta } = this.props;
    const {
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

      // Tablet Padding
      tabletPadding,
      tabletPaddingType,
      tabletPaddingSuffix,
      tabletPaddingLeft,
      tabletPaddingLeftSuffix,
      tabletPaddingRight,
      tabletPaddingRightSuffix,

      // Tablet margin
      tabletMargin,
      tabletMarginType,
      tabletMarginSuffix,
      tabletMarginLeft,
      tabletMarginLeftSuffix,
      tabletMarginRight,
      tabletMarginRightSuffix,

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

    const marginW =
      marginType === "grouped"
        ? percentageToPixels(margin * 2, marginSuffix, meta.desktopW)
        : percentageToPixels(marginLeft, marginLeftSuffix, meta.desktopW) +
          percentageToPixels(marginRight, marginRightSuffix, meta.desktopW);
    const paddingW =
      paddingType === "grouped"
        ? percentageToPixels(padding * 2, paddingSuffix, meta.desktopW)
        : percentageToPixels(paddingLeft, paddingLeftSuffix, meta.desktopW) +
          percentageToPixels(paddingRight, paddingRightSuffix, meta.desktopW);

    // Tablet
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
    const tabletMarginW =
      tabletMarginType === "grouped"
        ? percentageToPixels(tabletMargin * 2, tabletMarginSuffix, meta.tabletW)
        : percentageToPixels(
          tabletMarginLeft,
          tabletMarginLeftSuffix,
          meta.tabletW
        ) +
        percentageToPixels(
          tabletMarginRight,
          tabletMarginRightSuffix,
          meta.tabletW
        );

    // Mobile
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
    const mobileMarginW =
      mobileMarginType === "grouped"
        ? percentageToPixels(mobileMargin * 2, mobileMarginSuffix, meta.mobileW)
        : percentageToPixels(
            mobileMarginLeft,
            mobileMarginLeftSuffix,
            meta.mobileW
          ) +
          percentageToPixels(
            mobileMarginRight,
            mobileMarginRightSuffix,
            meta.mobileW
          );

    const externalSpacing = marginW + paddingW;
    const externalTabletSpacing = tabletMarginW + tabletPaddingW;
    const externalMobileSpacing = mobileMarginW + mobilePaddingW;

    const mobileW = Math.round((meta.mobileW - externalMobileSpacing) * 10) / 10;
    const tabletW = Math.round((meta.tabletW - externalTabletSpacing) * 10) / 10;
    const desktopW = Math.round((meta.desktopW - externalSpacing) * 10) / 10;

    return _.extend({}, meta, { mobileW, tabletW, desktopW, inCloneable: true });
  }

  renderContent(v) {
    const { minItems, maxItems, blockType } = v;
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      blockType,
      containerClassName: containerStyleClassName(v),
      itemClassName: itemsStyleClassName(v),
      minItems,
      maxItems,
      meta: this.getMeta(v),
      toolbarExtend: this.makeToolbarPropsFromConfig(toolbarExtendConfig),
      onSortableStart: this.handleSortableStart,
      onSortableEnd: this.handleSortableEnd,
      itemProps: {
        onToolbarEnter: this.handleToolbarEnter,
        onToolbarLeave: this.handleToolbarLeave
      }
    });

    return (
      <div className={wrapStyleClassName(v)}>
        <Items {...itemsProps} />
      </div>
    );
  }

  renderForEdit(v) {
    const { showBorder } = this.props;
    const style = {
      ...wrapStyleCSSVars(v),
      ...containerStyleCSSVars(v),
      ...itemsStyleCSSVars(v)
    };
    const { animationName, animationDuration, animationDelay } = v;

    return (
      <Animation
        className={styleClassName(v, this.props)}
        style={style}
        name={animationName !== "none" && animationName}
        duration={animationDuration}
        delay={animationDelay}
      >
        <ContainerBorder
          ref={el => {
            this.containerBorder = el;
          }}
          className="brz-ed-border__wrapper"
          borderStyle={showBorder ? "dotted" : "none"}
          activeBorderStyle={showBorder ? "dotted" : "none"}
          showBorders={showBorder}
          clickOutsideExceptions={[
            ".brz-ed-sidebar__right",
            "#brz-toolbar-portal",
            ".brz-ed-tooltip__content-portal"
          ]}
          path={this.props.path}
        >
          {this.renderContent(v)}
        </ContainerBorder>
      </Animation>
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

export default Cloneable;
