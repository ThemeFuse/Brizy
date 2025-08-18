import { MValue } from "@brizy/builder-ui-components/src/utils/value";
import classnames from "classnames";
import React from "react";
import Animation from "visual/component/Animation";
import {
  wInBoxedPage,
  wInFullPage,
  wInMobilePage,
  wInTabletPage
} from "visual/config/columns";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import {
  makeEndPlaceholder,
  makePlaceholder,
  makeStartPlaceholder
} from "visual/utils/dynamicContent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { cloneItem } from "visual/utils/models";
import {
  defaultValueValue,
  validateKeyByProperty
} from "visual/utils/onChange";
import { fromElementModel } from "visual/utils/options/Margin/converters";
import { handleLinkChange } from "visual/utils/patch/Link";
import * as State from "visual/utils/stateMode";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";
import { Literal } from "visual/utils/types/Literal";
import SectionItems from "./Items";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendConfig from "./sidebarExtend";
import { styleAnimation, styleSection } from "./styles";
import * as toolbarExtendConfig from "./toolbarExtend";
import { Meta, Patch, Props, Value } from "./type";
import { getV } from "./utils";

export default class Section extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId(): ElementTypes.Section {
    return ElementTypes.Section;
  }

  getMeta(v: Value) {
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

  patchValue(patch: Patch, meta: Meta): void {
    const link = handleLinkChange(patch);
    super.patchValue({ ...patch, ...link }, meta);
  }

  handleValueChange(value: Value, meta: Meta): void {
    if (value.items.length === 0) {
      this.selfDestruct();
    } else {
      const { patch, arrayOperation } = meta;
      const { slider, items } = value;

      if (
        arrayOperation === "remove" &&
        slider === "on" &&
        items.length === 1
      ) {
        super.handleValueChange(
          {
            ...value,
            slider: "off"
          },
          meta
        );
      } else if (patch && patch.slider === "on" && items.length === 1) {
        super.handleValueChange(
          {
            ...value,
            items: cloneItem(items, 0)
          },
          meta
        );
      } else {
        super.handleValueChange(value, meta);
      }
    }
  }

  dvv = (key: string): MValue<Literal> => {
    const v = this.getValue();
    const device = this.getDeviceMode();
    const state = State.mRead(v.tabsState);

    return defaultValueValue({ v, key, device, state });
  };

  getAnimationClassName = (v: Value, vs: Value, vd: Value) => {
    if (!validateKeyByProperty(v, "animationName", "none")) {
      return undefined;
    }

    const animationName = this.dvv("animationName");
    const animationDuration = this.dvv("animationDuration");
    const animationDelay = this.dvv("animationDelay");
    const animationInfiniteAnimation = this.dvv("animationInfiniteAnimation");

    const slug = `${animationName}-${animationDuration}-${animationDelay}-${animationInfiniteAnimation}`;

    return this.css(
      `${this.getComponentId()}-animation-${slug}`,
      `${this.getId()}-animation-${slug}`,
      styleAnimation({
        v,
        vs,
        vd,
        store: this.getReduxStore(),
        contexts: this.getContexts()
      })
    );
  };

  renderItems(v: Value): JSX.Element {
    const device = this.getDeviceMode();
    // const store = this.getReduxStore();
    const margin = fromElementModel(getV(v, device));

    const {
      membership,
      membershipRoles,
      sliderDots,
      sliderArrows,
      sliderAutoPlay,
      sliderAutoPlaySpeed,
      sliderAnimation,
      sliderAnimationSpeed,
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
      translationsLangs,
      stopSlider
    } = v;

    const isSliderAutoPlay = sliderAutoPlay === "on";
    const itemsProps = this.makeSubcomponentProps({
      sliderDots,
      sliderArrows,
      sliderAnimation,
      sliderAnimationSpeed,
      sliderAutoPlaySpeed,
      bindWithKey: "items",
      meta: this.getMeta(v),
      sliderAutoPlay: isSliderAutoPlay,
      stopSlider: stopSlider === "on" && isSliderAutoPlay,
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

    /* @ts-expect-error: Need transform SectionItems to ts */
    const content = <SectionItems {...itemsProps} />;

    return content;
  }

  renderForEdit(v: Value, vs: Value, vd: Value): JSX.Element {
    const { className, customClassName, cssClass, customAttributes } = v;

    const classNameSection = classnames(
      "brz-section",
      className,
      cssClass || customClassName,
      this.css(
        this.getComponentId(),
        this.getId(),
        styleSection({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
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

  renderLangOrMemberOrAll(content: JSX.Element, v: Value): JSX.Element {
    const { membershipRoles, translationsLangs, membership, translations } = v;

    const config = this.getGlobalConfig();

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

  renderForView(v: Value, vs: Value, vd: Value): JSX.Element {
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
      this.css(
        this.getComponentId(),
        this.getId(),
        styleSection({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const animationClassName = this.getAnimationClassName(v, vs, vd);

    const uidPlaceholder = makePlaceholder({
      content: "{{ globalblock_anchor }}",
      attr: { uid: this.getId() }
    });

    const uuid = `${uidPlaceholder}_${this.getId()}`;
    const blockName = cssID ? cssID : anchorName || uuid;

    const shouldAddUidAttr = cssID || anchorName;

    const props = {
      ...parseCustomAttributes(customAttributes),
      id: blockName,
      className: classNameSection,
      ...(shouldAddUidAttr
        ? makeDataAttr({
            name: "id",
            value: uuid
          })
        : {})
    };

    const content = (
      <>
        <Animation
          iterationCount={sectionPopup || sectionPopup2 ? Infinity : 1}
          component={tagName}
          componentProps={props}
          animationClass={animationClassName}
        >
          {this.renderItems(v)}
        </Animation>
      </>
    );

    return this.renderLangOrMemberOrAll(content, v);
  }
}
