import classnames from "classnames";
import React from "react";
import { mergeDeep } from "timm";
import Animation from "visual/component/Animation";
import Background from "visual/component/Background";
import ContainerBorder from "visual/component/ContainerBorder";
import CustomCSS from "visual/component/CustomCSS";
import PaddingResizer from "visual/component/PaddingResizer";
import { ProBlocked } from "visual/component/ProBlocked";
import { Roles } from "visual/component/Roles";
import { CollapsibleToolbar, ToolbarExtend } from "visual/component/Toolbar";
import {
  wInBoxedPage,
  wInFullPage,
  wInMobilePage,
  wInTabletPage
} from "visual/config/columns";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import {
  makeEndPlaceholder,
  makePlaceholder,
  makeStartPlaceholder
} from "visual/utils/dynamicContent";
import { isPro } from "visual/utils/env";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { hasMembership } from "visual/utils/membership";
import { hasMultiLanguage } from "visual/utils/multilanguages";
import {
  defaultValueValue,
  validateKeyByProperty
} from "visual/utils/onChange";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import * as State from "visual/utils/stateMode";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";
import SectionFooterItems from "./Items";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { styleAnimation, styleContainer, styleSection } from "./styles";
import * as toolbarConfig from "./toolbar";

class SectionFooter extends EditorComponent {
  static get componentId() {
    return "SectionFooter";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  mounted = false;

  collapsibleToolbarRef = React.createRef();

  isPro = isPro(this.getGlobalConfig());

  state = {
    isDragging: false,
    paddingPatch: null
  };

  getDBValue() {
    if (this.state.paddingPatch) {
      return mergeDeep(this.props.dbValue, this.state.paddingPatch);
    } else {
      return this.props.dbValue;
    }
  }

  componentDidMount() {
    this.mounted = true;
  }

  shouldComponentUpdate(nextProps) {
    return this.optionalSCU(nextProps) || this.state.paddingPatch;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleToolbarClose = () => {
    if (!this.mounted) {
      return;
    }

    this.patchValue({
      tabsState: "tabNormal",
      tabsCurrentElement: "tabCurrentElement",
      tabsColor: "tabOverlay"
    });
  };

  handleToolbarEscape = () => {
    this.collapsibleToolbarRef.current.open();
  };

  onPaddingResizerStart = () => {
    this.setState({ isDragging: true });
  };

  handlePaddingResizerChange = (patch) => {
    if (this.state.isDragging) {
      this.setState({ paddingPatch: patch });
    } else {
      this.patchValue(patch);
    }
  };

  onPaddingResizerEnd = () => {
    const paddingPatch = this.state.paddingPatch;
    this.setState({ isDragging: false, paddingPatch: null }, () =>
      this.handlePaddingResizerChange(paddingPatch)
    );
  };

  handleRemove = () => {
    this.selfDestruct();
  };

  dvv = (key, device) => {
    const v = this.getValue();
    const state = State.mRead(v.tabsState);

    return defaultValueValue({ v, key, device, state });
  };

  getMeta() {
    const { meta } = this.props;
    const device = this.getDeviceMode();

    const size = this.dvv("containerSize", DESKTOP);
    const tabletSize = this.dvv("containerSize", TABLET);
    const mobileSize = this.dvv("containerSize", MOBILE);

    const containerSizeSuffix = this.dvv("containerSizeSuffix", DESKTOP);
    const tabletContainerSizeSuffix = this.dvv("containerSizeSuffix", TABLET);
    const mobileContainerSizeSuffix = this.dvv("containerSizeSuffix", MOBILE);

    const desktopSuffix =
      containerSizeSuffix === "" ? "%" : containerSizeSuffix;
    const tabletSuffix =
      tabletContainerSizeSuffix === "" ? "%" : tabletContainerSizeSuffix;
    const mobileSuffix =
      mobileContainerSizeSuffix === "" ? "%" : mobileContainerSizeSuffix;

    const containerType = this.dvv("containerType", device);

    const wInPage = containerType === "fullWidth" ? wInFullPage : wInBoxedPage;

    const desktopW =
      desktopSuffix === "%"
        ? Math.round(wInPage * (size / 100) * 10) / 10
        : size;
    const tabletW =
      tabletSuffix === "%"
        ? Math.round(wInTabletPage * (tabletSize / 100) * 10) / 10
        : tabletSize;
    const mobileW =
      mobileSuffix === "%"
        ? Math.round(wInMobilePage * (mobileSize / 100) * 10) / 10
        : mobileSize;

    return {
      ...meta,
      desktopW,
      desktopWNoSpacing: desktopW,
      tabletW,
      tabletWNoSpacing: tabletW,
      mobileW,
      mobileWNoSpacing: mobileW
    };
  }

  getAnimationClassName = (v, vs, vd) => {
    if (!validateKeyByProperty(v, "animationName", "none")) {
      return undefined;
    }
    const device = this.getDeviceMode();

    const animationName = this.dvv("animationName", device);
    const animationDuration = this.dvv("animationDuration", device);
    const animationDelay = this.dvv("animationDelay", device);
    const animationInfiniteAnimation = this.dvv(
      "animationInfiniteAnimation",
      device
    );

    const slug = `${animationName}-${animationDuration}-${animationDelay}-${animationInfiniteAnimation}`;

    return this.css(
      `${this.getComponentId()}-animation-${slug}`,
      `${this.getId()}-animation-${slug}`,
      styleAnimation({
        v,
        vs,
        vd,
        store: this.getReduxStore(),
        renderContext: this.renderContext
      })
    );
  };

  renderToolbar(v) {
    const { globalBlockId } = this.props.meta;
    const { membership, membershipRoles, translations, translationsLangs } = v;
    return (
      <CollapsibleToolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        ref={this.collapsibleToolbarRef}
        className="brz-ed-collapsible--section"
        animation="rightToLeft"
        global={!!globalBlockId}
        membership={hasMembership(membership, membershipRoles)}
        onClose={this.handleToolbarClose}
        language={hasMultiLanguage(translations, translationsLangs)}
      />
    );
  }

  renderItems(v, vs, vd) {
    const meta = this.getMeta(v);
    const classNameContainer = classnames(
      "brz-container",
      v.containerClassName,
      this.css(
        `${this.getComponentId()}-container`,
        `${this.getId()}-container`,
        styleContainer({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
    );
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      className: classNameContainer,
      meta
    });

    return (
      <Background value={v} meta={meta}>
        <PaddingResizer
          value={v}
          onStart={this.onPaddingResizerStart}
          onChange={this.handlePaddingResizerChange}
          onEnd={this.onPaddingResizerEnd}
          renderContext={this.renderContext}
        >
          <SectionFooterItems {...itemsProps} />
        </PaddingResizer>
      </Background>
    );
  }

  renderForEdit(v, vs, vd) {
    const { className, customClassName, cssClass, customAttributes } = v;

    return this.isPro ? (
      <ContainerBorder
        type="footer"
        hiddenInResponsive={true}
        activateOnContentClick={false}
      >
        {({ ref: containerBorderRef, attr: containerBorderAttr }) => (
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            <Animation
              ref={containerBorderRef}
              component="footer"
              componentProps={{
                ...parseCustomAttributes(customAttributes),
                ...containerBorderAttr,
                ...makeDataAttr({
                  name: "block-id",
                  value: this.props.blockId
                }),
                id: this.getId(),
                className: classnames(
                  "brz-footer",
                  className,
                  cssClass || customClassName,
                  this.css(
                    `${this.getComponentId()}-section`,
                    `${this.getId()}-section`,
                    styleSection({
                      v,
                      vs,
                      vd,
                      store: this.getReduxStore(),
                      renderContext: this.renderContext
                    })
                  )
                )
              }}
              animationClass={this.getAnimationClassName(v, vs, vd)}
            >
              <Roles
                allow={["admin"]}
                fallbackRender={() => this.renderItems(v, vs, vd)}
              >
                {this.renderToolbar(v)}
                <ToolbarExtend onEscape={this.handleToolbarEscape}>
                  {this.renderItems(v, vs, vd)}
                </ToolbarExtend>
              </Roles>
            </Animation>
          </CustomCSS>
        )}
      </ContainerBorder>
    ) : (
      <footer className="brz-footer">
        <ProBlocked text={"Footer"} onRemove={this.handleRemove} />
      </footer>
    );
  }

  renderLangOrMemberOrAll(content, v) {
    const { membership, translations, translationsLangs, membershipRoles } = v;

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

  renderForView(v, vs, vd) {
    const { sectionPopup, sectionPopup2 } = this.props.meta;
    const {
      tagName,
      customCSS,
      className,
      anchorName,
      cssID,
      customClassName,
      customAttributes,
      cssClass
    } = v;

    const uidPlaceholder = makePlaceholder({
      content: "{{ random_id }}",
      attr: { key: this.getId() }
    });
    const blockName = cssID
      ? cssID
      : anchorName || `${uidPlaceholder}_${this.getId()}`;

    const content = (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <Animation
          iterationCount={sectionPopup || sectionPopup2 ? Infinity : 1}
          component={tagName}
          componentProps={{
            ...parseCustomAttributes(customAttributes),
            id: blockName,
            className: classnames(
              "brz-footer",
              className,
              cssClass || customClassName,
              this.css(
                `${this.getComponentId()}-section`,
                `${this.getId()}-section`,
                styleSection({
                  v,
                  vs,
                  vd,
                  store: this.getReduxStore(),
                  renderContext: this.renderContext
                })
              )
            )
          }}
          animationClass={this.getAnimationClassName(v, vs, vd)}
        >
          {this.renderItems(v, vs, vd)}
        </Animation>
      </CustomCSS>
    );

    return this.renderLangOrMemberOrAll(content, v);
  }
}

export default SectionFooter;
