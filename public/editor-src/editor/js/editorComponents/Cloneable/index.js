import React from "react";
import _ from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import ContainerBorder from "visual/component/ContainerBorder";
import Animation from "visual/component/Animation";
import { percentageToPixels } from "visual/utils/meta";
import Items from "./items";
import * as toolbarExtendConfig from "./toolbarExtend";
import * as sidebarExtendConfig from "./sidebarExtend";
import classnames from "classnames";
import { styleContainer, styleItem, styleWrap, style } from "./styles";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";

class Cloneable extends EditorComponent {
  static get componentId() {
    return "Cloneable";
  }

  static defaultProps = {
    className: "",
    customID: "",
    showBorder: true,
    meta: {}
  };

  static defaultValue = defaultValue;

  containerBorder = React.createRef();

  handleValueChange(value, meta) {
    if (value.items.length === 0) {
      this.selfDestruct();
    } else {
      super.handleValueChange(value, meta);
    }
  }

  handleSortableStart = () => {
    if (this.containerBorder.current) {
      this.containerBorder.current.setActive(true);
    }
  };

  handleSortableEnd = () => {
    if (this.containerBorder.current) {
      this.containerBorder.current.setActive(false);
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

    const mobileW =
      Math.round((meta.mobileW - externalMobileSpacing) * 10) / 10;
    const tabletW =
      Math.round((meta.tabletW - externalTabletSpacing) * 10) / 10;
    const desktopW = Math.round((meta.desktopW - externalSpacing) * 10) / 10;

    return _.extend({}, meta, {
      mobileW,
      tabletW,
      desktopW,
      inCloneable: true
    });
  }

  renderContent(v, vs, vd) {
    const { className, itemClassName } = v;

    const classNameContainer = classnames(
      "brz-d-xs-flex brz-flex-xs-wrap",
      css(
        `${this.constructor.componentId}-container`,
        `${this.getId()}-container`,
        styleContainer(v, vs, vd)
      ),
      className
    );

    const classNameItem = classnames(
      "brz-wrapper-clone__item",
      css(
        `${this.constructor.componentId}-item`,
        `${this.getId()}-item`,
        styleItem(v, vs, vd)
      ),
      itemClassName
    );

    const classNameWrapper = classnames(
      "brz-wrapper-clone__wrap",
      css(
        `${this.constructor.componentId}-wrap`,
        `${this.getId()}-wrap`,
        styleWrap(v, vs, vd)
      )
    );

    const { minItems, maxItems, blockType } = v;
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      blockType,
      containerClassName: classNameContainer,
      itemClassName: classNameItem,
      minItems,
      maxItems,
      meta: this.getMeta(v),
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        toolbarExtendConfig,
        sidebarExtendConfig
      ),
      onSortableStart: this.handleSortableStart,
      onSortableEnd: this.handleSortableEnd
    });

    return (
      <div className={classNameWrapper}>
        <Items {...itemsProps} />
      </div>
    );
  }

  renderForEdit(v, vs, vd) {
    const { showBorder, propsClassName } = this.props;
    const {
      animationName,
      animationDuration,
      animationDelay,
      customClassName,
      customID,
      cssIDPopulation,
      cssClassPopulation
    } = v;

    const className = classnames(
      "brz-wrapper-clone",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      ),
      cssClassPopulation === "" ? customClassName : cssClassPopulation,
      propsClassName
    );

    return (
      <Animation
        className={className}
        customID={cssIDPopulation === "" ? customID : cssIDPopulation}
        name={animationName !== "none" && animationName}
        duration={animationDuration}
        delay={animationDelay}
      >
        {showBorder ? (
          <ContainerBorder
            ref={this.containerBorder}
            color="grey"
            borderStyle="dotted"
          >
            {this.renderContent(v, vs, vd)}
          </ContainerBorder>
        ) : (
          this.renderContent(v, vs, vd)
        )}
      </Animation>
    );
  }

  renderForView(v, vs, vd) {
    const {
      animationName,
      animationDuration,
      animationDelay,
      customClassName,
      customID,
      cssIDPopulation,
      cssClassPopulation
    } = v;

    const { propsClassName } = this.props;

    const className = classnames(
      "brz-wrapper-clone",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      ),
      cssClassPopulation === "" ? customClassName : cssClassPopulation,
      propsClassName
    );

    return (
      <Animation
        className={className}
        customID={cssIDPopulation === "" ? customID : cssIDPopulation}
        name={animationName !== "none" && animationName}
        duration={animationDuration}
        delay={animationDelay}
      >
        {this.renderContent(v, vs, vd)}
      </Animation>
    );
  }
}

export default Cloneable;
