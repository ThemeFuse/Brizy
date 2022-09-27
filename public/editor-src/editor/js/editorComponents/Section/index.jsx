import classnames from "classnames";
import React from "react";
import Animation from "visual/component/Animation";
import { fromElementModel } from "visual/component/Options/types/dev/Margin/utils";
import {
  wInBoxedPage,
  wInFullPage,
  wInMobilePage,
  wInTabletPage
} from "visual/config/columns";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import Config from "visual/global/Config";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { deviceModeSelector } from "visual/redux/selectors";
import { css } from "visual/utils/cssStyle";
import { cloneItem } from "visual/utils/models";
import {
  defaultValueValue,
  validateKeyByProperty
} from "visual/utils/onChange";
import { NORMAL } from "visual/utils/stateMode";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";
import defaultValue from "./defaultValue.json";
import SectionItems from "./Items";
import * as sidebarExtendConfig from "./sidebarExtend";
import { styleAnimation, styleSection } from "./styles";
import * as toolbarExtendConfig from "./toolbarExtend";
import * as State from "visual/utils/stateMode";
import { getStore } from "visual/redux/store";

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

  dvv = key => {
    const v = this.getValue();
    const device = deviceModeSelector(getStore().getState());
    const state = State.mRead(v.tabsState);

    return defaultValueValue({ v, key, device, state });
  };

  getAnimationClassName = (v, vs, vd) => {
    if (!validateKeyByProperty(v, "animationName", "none")) {
      return undefined;
    }

    const animationName = this.dvv("animationName");
    const animationDuration = this.dvv("animationDuration");
    const animationDelay = this.dvv("animationDelay");
    const animationInfiniteAnimation = this.dvv("animationInfiniteAnimation");

    const slug = `${animationName}-${animationDuration}-${animationDelay}-${animationInfiniteAnimation}`;

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
      animationInfiniteAnimation,
      tabletAnimationName,
      tabletAnimationDuration,
      tabletAnimationDelay,
      tabletAnimationInfiniteAnimation,
      mobileAnimationName,
      mobileAnimationDuration,
      mobileAnimationDelay,
      mobileAnimationInfiniteAnimation,
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
          animationInfiniteAnimation,
          tabletAnimationName,
          tabletAnimationDuration,
          tabletAnimationDelay,
          tabletAnimationInfiniteAnimation,
          mobileAnimationName,
          mobileAnimationDuration,
          mobileAnimationDelay,
          mobileAnimationInfiniteAnimation,
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

  renderLangOrMemberOrAll(content, v) {
    const { membershipRoles, translationsLangs, membership, translations } = v;

    const onlyCloud = !(isCloud(config) && isShopify(config));
    const roles = JSON.parse(membershipRoles).join(",");
    const languages = JSON.parse(translationsLangs).join(",");

    if (membership === "on" && translations === "off" && onlyCloud) {
      return (
        <>
          {`{{display_by_roles roles="${roles}"}}`}
          {content}
          {"{{end_display_by_roles}}"}
        </>
      );
    } else if (membership === "off" && translations === "on" && onlyCloud) {
      return (
        <>
          {`{{display_by_translations translations="${languages}"}}`}
          {content}
          {"{{end_display_by_translations}}"}
        </>
      );
    } else if (membership === "on" && translations === "on" && onlyCloud) {
      return (
        <>
          {`{{display_by_roles roles="${roles}"}}`}
          {`{{display_by_translations translations="${languages}"}}`}
          {content}
          {"{{end_display_by_translations}}"}
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

    return this.renderLangOrMemberOrAll(content, v);
  }
}
