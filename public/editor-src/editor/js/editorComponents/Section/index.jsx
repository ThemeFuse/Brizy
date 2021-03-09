import React from "react";
import classnames from "classnames";
import { validateKeyByProperty } from "visual/utils/onChange";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Animation from "visual/component/Animation";
import {
  wInBoxedPage,
  wInTabletPage,
  wInMobilePage,
  wInFullPage
} from "visual/config/columns";
import { css } from "visual/utils/cssStyle";
import { getContainerW } from "visual/utils/meta";
import { cloneItem } from "visual/utils/models";
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
    const {
      w: desktopFullW,
      wNoSpacing: desktopFullWNoSpacing
    } = getContainerW({
      v,
      w: wInFullPage,
      wNoSpacing: wInFullPage,
      device: "desktop"
    });
    const {
      w: desktopBoxedW,
      wNoSpacing: desktopBoxedWNoSpacing
    } = getContainerW({
      v,
      w: wInBoxedPage,
      wNoSpacing: wInBoxedPage,
      device: "desktop"
    });
    const { w: tabletW, wNoSpacing: tabletWNoSpacing } = getContainerW({
      v,
      w: wInTabletPage,
      wNoSpacing: wInTabletPage,
      device: "tablet"
    });
    const { w: mobileW, wNoSpacing: mobileWNoSpacing } = getContainerW({
      v,
      w: wInMobilePage,
      wNoSpacing: wInMobilePage,
      device: "mobile"
    });

    return Object.assign({}, meta, {
      desktopFullW,
      desktopFullWNoSpacing,
      desktopBoxedW,
      desktopBoxedWNoSpacing,
      tabletW,
      tabletWNoSpacing,
      mobileW,
      mobileWNoSpacing,
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
            items: cloneItem(value.items, 0)
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
      membership,
      membershipRoles,
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
          membership,
          membershipRoles,
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

  renderMemberShipWrapper(content, v) {
    if (v.membership === "on") {
      const roles = JSON.parse(v.membershipRoles).join(",");

      return (
        <>
          {`{{display_by_roles roles="${roles}"}}`}
          {content}
          {"{{end_display_by_roles}}"}
        </>
      );
    }

    return content;
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
    const { sectionPopup, sectionPopup2 } = this.props.meta;

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

    const content = (
      <Animation
        iterationCount={sectionPopup || sectionPopup2 ? Infinity : 1}
        component={tagName}
        componentProps={props}
        animationClass={animationClassName}
      >
        {this.renderItems(v)}
      </Animation>
    );

    return this.renderMemberShipWrapper(content, v);
  }
}
