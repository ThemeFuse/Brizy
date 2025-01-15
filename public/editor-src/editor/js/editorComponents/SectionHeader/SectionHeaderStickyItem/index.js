import classnames from "classnames";
import React from "react";
import { mergeDeep } from "timm";
import _ from "underscore";
import Background from "visual/component/Background";
import ContainerBorder from "visual/component/ContainerBorder";
import CustomCSS from "visual/component/CustomCSS";
import PaddingResizer from "visual/component/PaddingResizer";
import { Roles } from "visual/component/Roles";
import { CollapsibleToolbar, ToolbarExtend } from "visual/component/Toolbar";
import {
  wInBoxedPage,
  wInFullPage,
  wInMobilePage,
  wInTabletPage
} from "visual/config/columns";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { deviceModeSelector } from "visual/redux/selectors";
import { hasMembership } from "visual/utils/membership";
import { hasMultiLanguage } from "visual/utils/multilanguages";
import { defaultValueValue } from "visual/utils/onChange";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import SectionHeaderStickyItemItems from "./Items";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { styleContainer, styleSection } from "./styles";
import * as toolbarConfig from "./toolbar";

export default class SectionHeaderStickyItem extends EditorComponent {
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

  static get componentId() {
    return "SectionHeaderStickyItem";
  }

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
    return (
      this.optionalSCU(nextProps) ||
      this.shouldUpdateBecauseOfParent(nextProps) ||
      this.state.paddingPatch
    );
  }

  shouldUpdateBecauseOfParent(nextProps) {
    return !_.isEqual(this.props.rerender, nextProps.rerender);
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

  dvv = (key, device) => {
    const v = this.getValue();
    return defaultValueValue({ v, key, device });
  };

  getMeta() {
    const { meta } = this.props;
    const device = deviceModeSelector(this.getReduxState());

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

  getSectionClassName(v, vs, vd) {
    return classnames(
      "brz-section__header-sticky-item",
      this.css(
        this.getComponentId(),
        this.getId(),
        styleSection({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
    );
  }

  renderToolbar() {
    const { globalBlockId } = this.props.meta;
    const { membership, membershipRoles, translations, translationsLangs } =
      this.props.rerender;

    return (
      <CollapsibleToolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        ref={this.collapsibleToolbarRef}
        className="brz-ed-collapsible--section"
        animation="rightToLeft"
        global={!!globalBlockId}
        membership={hasMembership(membership, membershipRoles)}
        language={hasMultiLanguage(translations, translationsLangs)}
        onClose={this.handleToolbarClose}
      />
    );
  }

  renderItems(v, vs, vd) {
    const meta = this.getMeta(v);
    const className = classnames(
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
      className,
      meta,
      bindWithKey: "items"
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
          <SectionHeaderStickyItemItems {...itemsProps} />
        </PaddingResizer>
      </Background>
    );
  }

  renderForEdit(v, vs, vd) {
    return (
      <ContainerBorder
        type="header__animated"
        hiddenInResponsive={true}
        activateOnContentClick={false}
      >
        {({ ref: containerBorderRef, attr: containerBorderAttr }) => (
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            <div
              ref={containerBorderRef}
              {...containerBorderAttr}
              className={this.getSectionClassName(v, vs, vd)}
            >
              <Roles
                allow={["admin"]}
                fallbackRender={() => this.renderItems(v, vs, vd)}
              >
                {this.renderToolbar()}
                <ToolbarExtend onEscape={this.handleToolbarEscape}>
                  {this.renderItems(v, vs, vd)}
                </ToolbarExtend>
              </Roles>
            </div>
          </CustomCSS>
        )}
      </ContainerBorder>
    );
  }

  renderForView(v, vs, vd) {
    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={this.getSectionClassName(v, vs, vd)}>
          {this.renderItems(v, vs, vd)}
        </div>
      </CustomCSS>
    );
  }
}
