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
import Config from "visual/global/Config";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { css } from "visual/utils/cssStyle";
import { IS_PRO } from "visual/utils/env";
import { hasMembership } from "visual/utils/membership";
import { hasMultiLanguage } from "visual/utils/multilanguages";
import {
  defaultValueValue,
  validateKeyByProperty
} from "visual/utils/onChange";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";
import {
  styleElementSectionContainerType,
  styleSizeContainerSize
} from "visual/utils/style2";
import defaultValue from "./defaultValue.json";
import SectionFooterItems from "./Items";
import * as sidebarConfig from "./sidebar";
import { styleAnimation, styleContainer, styleSection } from "./styles";
import * as toolbarConfig from "./toolbar";
import * as State from "visual/utils/stateMode";
import { deviceModeSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";

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

  handlePaddingResizerChange = patch => {
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

  getMeta(v) {
    const { meta } = this.props;
    const containerType = styleElementSectionContainerType({ v });
    const size = styleSizeContainerSize({ v, device: "desktop" });
    const tabletSize = styleSizeContainerSize({ v, device: "tablet" });
    const mobileSize = styleSizeContainerSize({ v, device: "mobile" });

    const wInPage = containerType === "fullWidth" ? wInFullPage : wInBoxedPage;
    const desktopW = Math.round(wInPage * (size / 100) * 10) / 10;
    const tabletW = Math.round(wInTabletPage * (tabletSize / 100) * 10) / 10;
    const mobileW = Math.round(wInMobilePage * (mobileSize / 100) * 10) / 10;

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
      css(
        `${this.constructor.componentId}-container`,
        `${this.getId()}-container`,
        styleContainer(v, vs, vd)
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
        >
          <SectionFooterItems {...itemsProps} />
        </PaddingResizer>
      </Background>
    );
  }

  renderForEdit(v, vs, vd) {
    const {
      className,
      customClassName,
      cssClassPopulation,
      customAttributes
    } = v;

    return IS_PRO ? (
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
                "data-block-id": this.props.blockId,
                id: this.getId(),
                className: classnames(
                  "brz-footer",
                  className,
                  cssClassPopulation === ""
                    ? customClassName
                    : cssClassPopulation,
                  css(
                    `${this.constructor.componentId}-section`,
                    `${this.getId()}-section`,
                    styleSection(v, vs, vd)
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

    const config = Config.getAll();

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
    const { sectionPopup, sectionPopup2 } = this.props.meta;
    const content = (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <Animation
          iterationCount={sectionPopup || sectionPopup2 ? Infinity : 1}
          component={v.tagName}
          componentProps={{
            ...parseCustomAttributes(v.customAttributes),
            "data-uid": this.getId(),
            id:
              v.cssIDPopulation === ""
                ? v.anchorName || this.getId()
                : v.cssIDPopulation,
            className: classnames(
              "brz-footer",
              v.className,
              v.cssClassPopulation === ""
                ? v.customClassName
                : v.cssClassPopulation,
              css(
                `${this.getComponentId()}-section`,
                `${this.getId()}-section`,
                styleSection(v, vs, vd)
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
