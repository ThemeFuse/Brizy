import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Items from "./items";
import { percentageToPixels } from "visual/utils/meta";
import { styleClassName, styleCSSVars } from "./styles";
import * as parentToolbarExtend from "./parentExtendToolbar";
import defaultValue from "./defaultValue.json";

class Carousel extends EditorComponent {
  static get componentId() {
    return "Carousel";
  }

  static defaultValue = defaultValue;

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig(parentToolbarExtend, {
      allowExtend: false
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
      mobileSliderPaddingType,
      mobileSliderPadding,
      mobileSliderPaddingSuffix,
      mobileSliderPaddingLeft,
      mobileSliderPaddingLeftSuffix,
      mobileSliderPaddingRight,
      mobileSliderPaddingRightSuffix
    } = v;
    const desktopW = meta.desktopW / slidesToShow;
    const paddingW =
      sliderPaddingType === "grouped"
        ? percentageToPixels(sliderPadding * 2, sliderPaddingSuffix, desktopW)
        : percentageToPixels(
            sliderPaddingLeft,
            sliderPaddingLeftSuffix,
            desktopW
          ) +
          percentageToPixels(
            sliderPaddingRight,
            sliderPaddingRightSuffix,
            desktopW
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
    const externalSpacing = spacing + paddingW;

    return Object.assign({}, meta, {
      desktopW: Math.round((desktopW - externalSpacing) * 10) / 10,
      mobileW: Math.round((meta.mobileW - mobilePaddingW) * 10) / 10,
      inCarousel: true,
      inGrid: false
    });
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
      swipe
    } = v;
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      className: styleClassName(v),
      style: styleCSSVars(v),
      meta: this.getMeta(v),
      slidesToShow,
      slidesToScroll,
      sliderArrows,
      sliderAutoPlay,
      sliderAutoPlaySpeed,
      sliderDots,
      swipe
    });

    return <Items {...itemsProps} />;
  }
}
export default Carousel;
