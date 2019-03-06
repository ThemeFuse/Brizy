import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import Items from "./items";
import { percentageToPixels } from "visual/utils/meta";
import { styleClassName, styleCSSVars } from "./styles";
import * as parentToolbarExtend from "./parentExtendToolbar";
import * as toolbarExtend from "./toolbarExtend";
import defaultValue from "./defaultValue.json";

class Carousel extends EditorComponent {
  static get componentId() {
    return "Carousel";
  }

  static defaultValue = defaultValue;

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig(parentToolbarExtend, {
      allowExtend: false,
      filterExtendName: `${this.constructor.componentId}_parent`
    });

    this.props.extendParentToolbar(toolbarExtend);
  }

  shouldComponentUpdate(nextProps) {
    return this.optionalSCU(nextProps);
  }

  getMeta(v) {
    const { meta } = this.props;
    const {
      slidesToShow,
      spacing,
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
      mobileSliderPaddingRightSuffix
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
    const desktopW = meta.desktopW - (spacing + paddingW);
    const tabletW = meta.tabletW - (spacing + tabletPaddingW);

    return {
      ...meta,
      desktopW: Math.round((desktopW / slidesToShow) * 10) / 10,
      tabletW: Math.round((tabletW / tabletSlidesToShow) * 10) / 10,
      mobileW: Math.round((meta.mobileW - mobilePaddingW) * 10) / 10,
      inCarousel: true,
      inGrid: false
    };
  }

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.sliderArrowsColorPalette &&
        `${_v.sliderArrowsColorPalette}__arrowsColor`,
      _v.sliderDotsColorPalette && `${_v.sliderDotsColorPalette}__dotsColor`
    ]);
    const {
      slidesToShow,
      slidesToScroll,
      sliderArrows,
      sliderAutoPlay,
      sliderAutoPlaySpeed,
      sliderDots,
      swipe,
      dynamic,
      columns,
      taxonomy,
      taxonomyId,
      orderBy,
      order,
      tabletSlidesToShow
    } = v;
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      toolbarExtend: this.makeToolbarPropsFromConfig(toolbarExtend, {
        allowExtend: false
      }),
      className: styleClassName(v),
      style: styleCSSVars(v),
      meta: this.getMeta(v),
      slidesToShow,
      slidesToScroll,
      sliderArrows,
      sliderAutoPlay,
      sliderAutoPlaySpeed,
      sliderDots,
      swipe,
      dynamic,
      columns,
      taxonomy,
      taxonomyId,
      orderBy,
      order,
      tabletSlidesToShow
    });

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <Items {...itemsProps} />
      </CustomCSS>
    );
  }
}
export default Carousel;
