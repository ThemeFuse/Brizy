import React from "react";
import classnames from "classnames";
import Config from "visual/global/Config";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import {
  defaultValueValue,
  validateKeyByProperty
} from "visual/utils/onChange";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Animation from "visual/component/Animation";
import {
  wInBoxedPage,
  wInTabletPage,
  wInMobilePage,
  wInFullPage
} from "visual/config/columns";
import { css } from "visual/utils/cssStyle";
import { cloneItem } from "visual/utils/models";
import * as toolbarExtendConfig from "./toolbarExtend";
import * as sidebarExtendConfig from "./sidebarExtend";
import { styleSection, styleAnimation } from "./styles";
import SectionItems from "./Items";
import defaultValue from "./defaultValue.json";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";
import { deviceModeSelector } from "visual/redux/selectors";
import { fromElementModel } from "visual/component/Options/types/dev/Margin/utils";
import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import { NORMAL } from "visual/utils/stateMode";

const config = Config.getAll();

const getV = (v, device) => key =>
  defaultValueValue({
    v,
    key: createOptionId("margin", key),
    device,
    state: NORMAL
  });

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

    return Object.assign({}, meta, {
      desktopFullW: wInFullPage,
      desktopFullWNoSpacing: wInFullPage,
      desktopBoxedW: wInBoxedPage,
      desktopBoxedWNoSpacing: wInBoxedPage,
      tabletW: wInTabletPage,
      tabletWNoSpacing: wInTabletPage,
      mobileW: wInMobilePage,
      mobileWNoSpacing: wInMobilePage,
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

  getAnimationClassName = (v, vs, vd) => {
    if (!validateKeyByProperty(v, "animationName", "none")) {
      return undefined;
    }

    const animationName = defaultValueValue({ v, key: "animationName" });
    const animationDuration = defaultValueValue({
      v,
      key: "animationDuration"
    });
    const animationDelay = defaultValueValue({ v, key: "animationDelay" });
    const slug = `${animationName}-${animationDuration}-${animationDelay}`;

    return classnames(
      css(
        `${this.getComponentId()}-animation-${slug}`,
        `${this.getId()}-animation-${slug}`,
        styleAnimation(v, vs, vd)
      )
    );
  };

  renderItems(v) {
    const device = deviceModeSelector(this.getReduxState());
    const margin = fromElementModel(getV(v, device));

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
      tabletVerticalAlign,
      mobileVerticalAlign,
      fullHeight,
      tabletFullHeight,
      mobileFullHeight,
      tagName,
      cssIDPopulation,
      cssClassPopulation,
      customAttributesPopulation,
      marginType,
      tabletMarginType,
      mobileMarginType,
      animationName,
      animationDuration,
      animationDelay,
      tabletAnimationName,
      tabletAnimationDuration,
      tabletAnimationDelay,
      mobileAnimationName,
      mobileAnimationDuration,
      mobileAnimationDelay,
      translations,
      translationsLangs
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
          tabletVerticalAlign,
          mobileVerticalAlign,
          fullHeight,
          tabletFullHeight,
          mobileFullHeight,
          tagName,
          cssIDPopulation,
          cssClassPopulation,
          customAttributesPopulation,
          marginType,
          membership,
          membershipRoles,
          tabletMarginType,
          mobileMarginType,
          animationName,
          animationDuration,
          animationDelay,
          tabletAnimationName,
          tabletAnimationDuration,
          tabletAnimationDelay,
          mobileAnimationName,
          mobileAnimationDuration,
          mobileAnimationDelay,
          translations,
          translationsLangs,
          ...margin
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

    const animationClassName = this.getAnimationClassName(v, vs, vd);

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
    if (v.membership === "on" && !(isCloud(config) && isShopify(config))) {
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

    const animationClassName = this.getAnimationClassName(v, vs, vd);

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
