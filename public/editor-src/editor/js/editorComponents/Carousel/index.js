import React from "react";
import { noop } from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import ContextMenu from "visual/component/ContextMenu";
import contextMenuConfig from "./contextMenu";
import Items from "./items";
import { percentageToPixels } from "visual/utils/meta";
import { styleClassName, styleCSSVars } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as toolbarExtend from "./toolbarExtend";
import * as sidebarExtendParent from "./sidebarExtendParent";
import defaultValue from "./defaultValue.json";

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
    const desktopW = meta.desktopW - (spacing + paddingW);
    const tabletW = meta.tabletW - (spacing + tabletPaddingW);

    return {
      ...meta,
      desktopW: Math.round((desktopW / slidesToShow) * 10) / 10,
      desktopWNoSpacing:
        Math.round((meta.desktopWNoSpacing / slidesToShow) * 10) / 10,
      tabletW: Math.round((tabletW / tabletSlidesToShow) * 10) / 10,
      tabletWNoSpacing:
        Math.round((meta.tabletWNoSpacing / tabletSlidesToShow) * 10) / 10,
      mobileW: Math.round((meta.mobileW - mobilePaddingW) * 10) / 10,
      mobileWNoSpacing: meta.mobileWNoSpacing,
      inCarousel: true,
      inGrid: false
    };
  }

  renderForEdit(v) {
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
      toolbarExtend: this.makeToolbarPropsFromConfig2(toolbarExtend, null, {
        allowExtend: false,
        allowExtendFromThirdParty: true
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
        <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
          <Items {...itemsProps} />
        </ContextMenu>
      </CustomCSS>
    );
  }
}
export default Carousel;
