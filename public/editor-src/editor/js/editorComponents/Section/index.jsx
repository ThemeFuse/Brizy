import React from "react";
import classnames from "classnames";
import { validateKeyByProperty } from "visual/utils/onChange";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Animation from "visual/component/Animation";
import {
  wInBoxedPage,
  wInTabletPage,
  wInMobilePage,
  wInFullPage
} from "visual/config/columns";
import { css } from "visual/utils/cssStyle";
import { getContainerW } from "visual/utils/meta";
import * as toolbarExtendConfig from "./toolbarExtend";
import * as sidebarExtendConfig from "./sidebarExtend";
import { styleSection, styleAnimation } from "./styles";
import SectionItems from "./Items";
import defaultValue from "./defaultValue.json";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";

export default class Section extends EditorComponent {
  static get componentId() {
    return "Section";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  getMeta(v) {
    const { meta } = this.props;
    const { slider } = v;
    const desktopFullW = getContainerW({
      v,
      w: wInFullPage,
      device: "desktop"
    });
    const desktopBoxedW = getContainerW({
      v,
      w: wInBoxedPage,
      device: "desktop"
    });
    const tabletW = getContainerW({
      v,
      w: wInTabletPage,
      device: "tablet"
    });
    const mobileW = getContainerW({
      v,
      w: wInMobilePage,
      device: "mobile"
    });

    return Object.assign({}, meta, {
      desktopFullW,
      desktopBoxedW,
      tabletW,
      mobileW,
      section: {
        isSlider: slider === "on"
      }
    });
  }

  shouldComponentUpdate(nextProps) {
    return this.optionalSCU(nextProps);
  }

  handleValueChange(value, meta) {
    if (value.items.length === 0) {
      this.selfDestruct();
    } else {
      const { patch } = meta;

      if (patch && patch.slider === "on" && value.items.length === 1) {
        super.handleValueChange(
          {
            ...value,
            items: EditorArrayComponent.cloneItem(value.items, 0)
          },
          meta
        );
      } else {
        super.handleValueChange(value, meta);
      }
    }
  }

  renderItems(v) {
    const {
      sliderDots,
      sliderArrows,
      sliderAutoPlay,
      sliderAutoPlaySpeed,
      sliderAnimation,
      showOnDesktop,
      showOnTablet,
      showOnMobile,
      verticalAlign,
      fullHeight,
      tagName,
      cssIDPopulation,
      cssClassPopulation,
      customAttributesPopulation,
      marginType,
      tabletMarginType,
      mobileMarginType
    } = v;

    const itemsProps = this.makeSubcomponentProps({
      sliderDots,
      sliderArrows,
      sliderAnimation,
      sliderAutoPlaySpeed,
      bindWithKey: "items",
      meta: this.getMeta(v),
      className: "brz-section__items",
      sliderAutoPlay: sliderAutoPlay === "on",
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        toolbarExtendConfig,
        sidebarExtendConfig
      ),
      itemProps: {
        rerender: {
          showOnDesktop,
          showOnTablet,
          showOnMobile,
          verticalAlign,
          fullHeight,
          tagName,
          cssIDPopulation,
          cssClassPopulation,
          customAttributesPopulation,
          marginType,
          tabletMarginType,
          mobileMarginType
        }
      }
    });

    return <SectionItems {...itemsProps} />;
  }

  renderForEdit(v, vs, vd) {
    const {
      className,
      customClassName,
      cssClassPopulation,
      customAttributes
    } = v;

    const classNameSection = classnames(
      "brz-section",
      className,
      cssClassPopulation === "" ? customClassName : cssClassPopulation,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleSection(v, vs, vd)
      )
    );

    const animationClassName = classnames(
      validateKeyByProperty(v, "animationName", "none") &&
        css(
          `${this.constructor.componentId}-wrapper-animation,`,
          `${this.getId()}-animation`,
          styleAnimation(v, vs, vd)
        )
    );

    const props = {
      ...parseCustomAttributes(customAttributes),
      "data-block-id": this.props.blockId,
      "data-uid": this.getId(),
      id: this.getId(),
      className: classNameSection
    };

    return (
      <Animation
        component="section"
        componentProps={props}
        animationClass={animationClassName}
      >
        {this.renderItems(v)}
      </Animation>
    );
  }

  renderForView(v, vs, vd) {
    const {
      className,
      tagName,
      customClassName,
      cssIDPopulation,
      cssClassPopulation,
      customAttributes
    } = v;

    const classNameSection = classnames(
      "brz-section",
      className,
      cssClassPopulation === "" ? customClassName : cssClassPopulation,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleSection(v, vs, vd)
      )
    );

    const animationClassName = classnames(
      validateKeyByProperty(v, "animationName", "none") &&
        css(
          `${this.constructor.componentId}-wrapper-animation,`,
          `${this.getId()}-animation`,
          styleAnimation(v, vs, vd)
        )
    );

    const props = {
      ...parseCustomAttributes(customAttributes),
      "data-uid": this.getId(),
      id:
        cssIDPopulation === "" ? v.anchorName || this.getId() : cssIDPopulation,
      className: classNameSection
    };

    return (
      <Animation
        component={tagName}
        componentProps={props}
        animationClass={animationClassName}
      >
        {this.renderItems(v)}
      </Animation>
    );
  }
}
