import classNames from "classnames";
import { noop } from "es-toolkit";
import React from "react";
import ContextMenu from "visual/component/ContextMenu";
import CustomCSS from "visual/component/CustomCSS";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { percentageToPixels } from "visual/utils/meta";
import { attachRefs } from "visual/utils/react";
import contextMenuConfig from "./contextMenu";
import defaultValue from "./defaultValue.json";
import Items from "./items";
import * as sidebarExtendParent from "./sidebarExtendParent";
import { style } from "./styles";
import toolbarConfigFn from "./toolbarExtend";
import * as toolbarExtendParent from "./toolbarExtendParent";

class Carousel extends EditorComponent {
  static defaultValue = defaultValue;
  static defaultProps = {
    extendParentToolbar: noop
  };

  static get componentId() {
    return "Carousel";
  }

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParent,
      {
        allowExtend: false
      }
    );

    this.props.extendParentToolbar(toolbarExtend);
  }

  shouldComponentUpdate(nextProps) {
    return this.optionalSCU(nextProps);
  }

  handleValueChange(value, meta) {
    if (value.items.length === 0) {
      this.selfDestruct();
    } else {
      super.handleValueChange(value, meta);
    }
  }

  getMeta(v) {
    const { meta } = this.props;
    const {
      slidesToShow,
      sliderPaddingType,
      sliderPadding,
      sliderPaddingSuffix,
      sliderPaddingLeft,
      sliderPaddingLeftSuffix,
      sliderPaddingRight,
      sliderPaddingRightSuffix,
      tabletSlidesToShow,
      tabletSliderPaddingType,
      tabletSliderPadding,
      tabletSliderPaddingSuffix,
      tabletSliderPaddingLeft,
      tabletSliderPaddingLeftSuffix,
      tabletSliderPaddingRight,
      tabletSliderPaddingRightSuffix,
      mobileSliderPaddingType,
      mobileSliderPadding,
      mobileSliderPaddingSuffix,
      mobileSliderPaddingLeft,
      mobileSliderPaddingLeftSuffix,
      mobileSliderPaddingRight,
      mobileSliderPaddingRightSuffix,
      mobileSlidesToShow
    } = v;

    const paddingW =
      sliderPaddingType === "grouped"
        ? percentageToPixels(
            sliderPadding * 2,
            sliderPaddingSuffix,
            meta.desktopW
          )
        : percentageToPixels(
            sliderPaddingLeft,
            sliderPaddingLeftSuffix,
            meta.desktopW
          ) +
          percentageToPixels(
            sliderPaddingRight,
            sliderPaddingRightSuffix,
            meta.desktopW
          );

    const tabletPaddingW =
      tabletSliderPaddingType === "grouped"
        ? percentageToPixels(
            tabletSliderPadding * 2,
            tabletSliderPaddingSuffix,
            meta.tabletW
          )
        : percentageToPixels(
            tabletSliderPaddingLeft,
            tabletSliderPaddingLeftSuffix,
            meta.tabletW
          ) +
          percentageToPixels(
            tabletSliderPaddingRight,
            tabletSliderPaddingRightSuffix,
            meta.tabletW
          );

    const mobilePaddingW =
      mobileSliderPaddingType === "grouped"
        ? percentageToPixels(
            mobileSliderPadding * 2,
            mobileSliderPaddingSuffix,
            meta.mobileW
          )
        : percentageToPixels(
            mobileSliderPaddingLeft,
            mobileSliderPaddingLeftSuffix,
            meta.mobileW
          ) +
          percentageToPixels(
            mobileSliderPaddingRight,
            mobileSliderPaddingRightSuffix,
            meta.mobileW
          );

    const desktopW = meta.desktopW - paddingW;
    const tabletW = meta.tabletW - tabletPaddingW;
    const mobileW = meta.mobileW - mobilePaddingW;

    return {
      ...meta,
      desktopW: Math.round(desktopW / slidesToShow),
      desktopWNoSpacing: Math.round(meta.desktopWNoSpacing / slidesToShow),
      tabletW: Math.round(tabletW / tabletSlidesToShow),
      tabletWNoSpacing: Math.round(meta.tabletWNoSpacing / tabletSlidesToShow),
      mobileW: Math.round(mobileW / mobileSlidesToShow),
      mobileWNoSpacing: Math.round(meta.mobileWNoSpacing / mobileSlidesToShow),
      inCarousel: true,
      inGrid: false
    };
  }

  renderForEdit(v, vs, vd) {
    const {
      slidesToShow,
      slidesToScroll,
      sliderArrows,
      sliderAutoPlay,
      sliderAutoPlaySpeed,
      sliderAnimation,
      sliderDots,
      transitionSpeed,
      swipe,
      dynamic,
      columns,
      taxonomy,
      taxonomyId,
      orderBy,
      order,
      tabletSlidesToShow,
      mobileSlidesToShow,
      customCSS,
      stopSlider
    } = v;
    const carouselClassName = classNames(
      "brz-carousel",
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const toolbarConfig = toolbarConfigFn(v, this.handleValueChange);
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      toolbarExtend: this.makeToolbarPropsFromConfig2(toolbarConfig, null, {
        allowExtend: false,
        allowExtendFromThirdParty: true
      }),
      className: carouselClassName,
      meta: this.getMeta(v),
      slidesToShow,
      slidesToScroll,
      sliderArrows,
      sliderAutoPlay,
      sliderAutoPlaySpeed,
      sliderDots,
      sliderAnimation,
      transitionSpeed,
      swipe,
      dynamic,
      columns,
      taxonomy,
      taxonomyId,
      orderBy,
      order,
      tabletSlidesToShow,
      mobileSlidesToShow,
      stopSlider: stopSlider === "on" && sliderAutoPlay === "on"
    });

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        {({ ref: cssRef }) => (
          <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
            {({ ref: contextMenuRef }) => (
              <Items
                {...itemsProps}
                containerRef={(el) => attachRefs(el, [cssRef, contextMenuRef])}
              />
            )}
          </ContextMenu>
        )}
      </CustomCSS>
    );
  }
}
export default Carousel;
