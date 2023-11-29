import classnames from "classnames";
import React from "react";
import Animation from "visual/component/Animation";
import { fromElementModel } from "visual/component/Options/types/dev/Margin/converters";
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
import { getStore } from "visual/redux/store";
import { css } from "visual/utils/cssStyle";
import {
  makeEndPlaceholder,
  makeStartPlaceholder
} from "visual/utils/dynamicContent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { cloneItem } from "visual/utils/models";
import {
  defaultValueValue,
  validateKeyByProperty
} from "visual/utils/onChange";
import { NORMAL } from "visual/utils/stateMode";
import * as State from "visual/utils/stateMode";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";
import SectionItems from "./Items";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendConfig from "./sidebarExtend";
import { styleAnimation, styleSection } from "./styles";
import * as toolbarExtendConfig from "./toolbarExtend";

const config = Config.getAll();

const getV = (v, device) => (key) =>
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

  dvv = (key) => {
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
      cssID,
      cssClass,
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
          cssID,
          cssClass,
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
    const { className, customClassName, cssClass, customAttributes } = v;

    const classNameSection = classnames(
      "brz-section",
      className,
      cssClass || customClassName,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleSection(v, vs, vd)
      )
    );

    const animationClassName = this.getAnimationClassName(v, vs, vd);

    const props = {
      ...parseCustomAttributes(customAttributes),
      ...makeDataAttr({ name: "block-id", value: this.props.blockId }),
      ...makeDataAttr({ name: "uid", value: this.getId() }),
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
      const startPlaceholder = makeStartPlaceholder({
        content: "{{display_by_roles}}",
        attr: { roles }
      });
      const endPlaceholder = makeEndPlaceholder({
        content: "{{end_display_by_roles}}"
      });
      return (
        <>
          {startPlaceholder}
          {content}
          {endPlaceholder}
        </>
      );
    } else if (membership === "off" && translations === "on" && onlyCloud) {
      const startPlaceholder = makeStartPlaceholder({
        content: "{{display_by_translations}}",
        attr: { translations: languages }
      });
      const endPlaceholder = makeEndPlaceholder({
        content: "{{end_display_by_translations}}"
      });
      return (
        <>
          {startPlaceholder}
          {content}
          {endPlaceholder}
        </>
      );
    } else if (membership === "on" && translations === "on" && onlyCloud) {
      const startRolesPlaceholder = makeStartPlaceholder({
        content: "{{display_by_roles}}",
        attr: { roles }
      });
      const endRolesPlaceholder = makeEndPlaceholder({
        content: "{{end_display_by_roles}}"
      });
      const startTranslationsPlaceholder = makeStartPlaceholder({
        content: "{{display_by_translations}}",
        attr: { translations: languages }
      });
      const endTranslationsPlaceholder = makeEndPlaceholder({
        content: "{{end_display_by_translations}}"
      });
      return (
        <>
          {startRolesPlaceholder}
          {startTranslationsPlaceholder}
          {content}
          {endTranslationsPlaceholder}
          {endRolesPlaceholder}
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
      cssID,
      cssClass,
      customAttributes,
      anchorName
    } = v;
    const { sectionPopup, sectionPopup2 } = this.props.meta;

    const classNameSection = classnames(
      "brz-section",
      className,
      cssClass || customClassName,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleSection(v, vs, vd)
      )
    );

    const animationClassName = this.getAnimationClassName(v, vs, vd);
    const blockName = cssID ? cssID : anchorName || this.getId();

    const props = {
      ...parseCustomAttributes(customAttributes),
      id: blockName,
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
