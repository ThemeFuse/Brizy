import classNames from "classnames";
import React from "react";
import { noop } from "underscore";
import ContextMenu from "visual/component/ContextMenu";
import CustomCSS from "visual/component/CustomCSS";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { css } from "visual/utils/cssStyle";
import { percentageToPixels } from "visual/utils/meta";
import { defaultValueValue } from "visual/utils/onChange";
import { MOBILE, TABLET } from "visual/utils/responsiveMode";
import contextMenuConfig from "./contextMenu";
import defaultValue from "./defaultValue.json";
import Items from "./items";
import * as sidebarExtendParent from "./sidebarExtendParent";
import { style } from "./styles";
import * as toolbarExtend from "./toolbarExtend";
import * as toolbarExtendParent from "./toolbarExtendParent";

class Carousel extends EditorComponent {
  static get componentId() {
    return "Carousel";
  }

  static defaultValue = defaultValue;

  static defaultProps = {
    extendParentToolbar: noop
  };

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

    const tabletSpacing = defaultValueValue({
      v,
      key: "spacing",
      device: TABLET,
      state: "normal"
    });
    const mobileSpacing = defaultValueValue({
      v,
      key: "spacing",
      device: MOBILE,
      state: "normal"
    });
    const desktopW = meta.desktopW - (spacing + paddingW);
    const tabletW = meta.tabletW - (tabletSpacing + tabletPaddingW);
    const mobileW = meta.mobileW - (mobileSpacing + mobilePaddingW);

    return {
      ...meta,
      desktopW: Math.round((desktopW / slidesToShow) * 10) / 10,
      desktopWNoSpacing:
        Math.round((meta.desktopWNoSpacing / slidesToShow) * 10) / 10,
      tabletW: Math.round((tabletW / tabletSlidesToShow) * 10) / 10,
      tabletWNoSpacing:
        Math.round((meta.tabletWNoSpacing / tabletSlidesToShow) * 10) / 10,
      mobileW: Math.round(mobileW * 10) / 10,
      mobileWNoSpacing: meta.mobileWNoSpacing,
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
      sliderDots,
      swipe,
      dynamic,
      columns,
      taxonomy,
      taxonomyId,
      orderBy,
      order,
      tabletSlidesToShow,
      customCSS
    } = v;
    const carouselClassName = classNames(
      "brz-carousel",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      toolbarExtend: this.makeToolbarPropsFromConfig2(toolbarExtend, null, {
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
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
          <Items {...itemsProps} />
        </ContextMenu>
      </CustomCSS>
    );
  }
}
export default Carousel;
