import classnames from "classnames";
import React from "react";
import { mergeDeep } from "timm";
import _ from "underscore";
import Background from "visual/component/Background";
import ContainerBorder from "visual/component/ContainerBorder";
import CustomCSS from "visual/component/CustomCSS";
import Link from "visual/component/Link";
import PaddingResizer from "visual/component/PaddingResizer";
import { Roles } from "visual/component/Roles";
import { CollapsibleToolbar, ToolbarExtend } from "visual/component/Toolbar";
import {
  minWInBoxedPage,
  minWInMobilePage,
  minWInTabletPage,
  wInMobilePage,
  wInTabletPage
} from "visual/config/columns";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import { isEditor } from "visual/providers/RenderProvider";
import { blocksDataSelector } from "visual/redux/selectors";
import { clamp } from "visual/utils/math";
import { hasMembership } from "visual/utils/membership";
import { getLinkData } from "visual/utils/models/link";
import { hasMultiLanguage } from "visual/utils/multilanguages";
import { defaultValueValue } from "visual/utils/onChange";
import { handleLinkChange } from "visual/utils/patch/Link";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import defaultValue from "./defaultValue.json";
import Items from "./items";
import * as sidebarConfig from "./sidebar";
import { style, styleContainer } from "./styles";
import * as toolbarConfig from "./toolbar";

class SectionItem extends EditorComponent {
  static get componentId() {
    return "SectionItem";
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

  shouldUpdateBecauseOfParent(nextProps) {
    return (
      this.props.meta.section.isSlider ||
      !_.isEqual(this.props.rerender, nextProps.rerender)
    );
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.optionalSCU(nextProps) ||
      this.shouldUpdateBecauseOfParent(nextProps) ||
      this.state.paddingPatch
    );
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleToolbarEscape = () => {
    this.collapsibleToolbarRef.current.open();
  };

  onPaddingResizerStart = () => {
    this.setState({ isDragging: true });
  };

  patchValue(patch, meta = {}) {
    const link = handleLinkChange(patch);
    super.patchValue({ ...patch, ...link }, meta);
  }

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

    const _desktopW =
      containerType === "fullWidth" ? meta.desktopFullW : meta.desktopBoxedW;

    const _desktopWNoSpacing =
      containerType === "fullWidth"
        ? meta.desktopFullWNoSpacing
        : meta.desktopBoxedWNoSpacing;

    const maxAdmissibleDesktopWidth = meta.desktopFullW;

    const desktopW =
      desktopSuffix === "%"
        ? clamp(
            Math.round(_desktopW * (size / 100) * 10) / 10,
            minWInBoxedPage,
            maxAdmissibleDesktopWidth
          )
        : clamp(size, minWInBoxedPage, maxAdmissibleDesktopWidth);

    const desktopWNoSpacing =
      desktopSuffix === "%"
        ? clamp(
            Math.round(_desktopWNoSpacing * (size / 100) * 10) / 10,
            minWInBoxedPage,
            maxAdmissibleDesktopWidth
          )
        : clamp(size, minWInBoxedPage, maxAdmissibleDesktopWidth);

    const tabletW =
      tabletSuffix === "%"
        ? clamp(
            Math.round(meta.tabletW * (tabletSize / 100) * 10) / 10,
            minWInTabletPage,
            wInTabletPage
          )
        : clamp(tabletSize, minWInTabletPage, wInTabletPage);

    const tabletWNoSpacing =
      tabletSuffix === "%"
        ? clamp(
            Math.round(meta.tabletWNoSpacing * (tabletSize / 100) * 10) / 10,
            minWInTabletPage,
            wInTabletPage
          )
        : clamp(tabletSize, minWInTabletPage, wInTabletPage);

    const mobileW =
      mobileSuffix === "%"
        ? clamp(
            Math.round(meta.mobileW * (mobileSize / 100) * 10) / 10,
            minWInMobilePage,
            wInMobilePage
          )
        : clamp(mobileSize, minWInMobilePage, wInMobilePage);

    const mobileWNoSpacing =
      mobileSuffix === "%"
        ? clamp(
            Math.round(meta.mobileWNoSpacing * (mobileSize / 100) * 10) / 10,
            minWInMobilePage,
            wInMobilePage
          )
        : clamp(mobileSize, minWInMobilePage, wInMobilePage);

    return {
      ...meta,
      desktopW,
      desktopWNoSpacing,
      tabletW,
      tabletWNoSpacing,
      mobileW,
      mobileWNoSpacing
    };
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
          <Items {...itemsProps} />
        </PaddingResizer>
      </Background>
    );
  }

  renderPopups() {
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: (itemData) => {
        let {
          value: { popupId }
        } = itemData;
        const { blockId } = itemData;

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          const globalBlocks = blocksDataSelector(this.getReduxState());
          const blockData = globalBlocks[itemData.value._id];

          popupId = blockData.value.popupId;
        }

        return {
          blockId,
          instanceKey: isEditor(this.renderContext)
            ? `${this.getId()}_${popupId}`
            : itemData.type === "GlobalBlock"
              ? `global_${popupId}`
              : popupId
        };
      }
    });

    // @ts-expect-error: Need transform EditorArrayComponents to ts
    return <EditorArrayComponent {...popupsProps} />;
  }

  renderForEdit(v, vs, vd) {
    const { className, containerType, customCSS } = v;
    const classNameSectionContent = classnames(
      "brz-section__content",
      `brz-section--${containerType}`,
      className,
      this.css(
        `${this.getComponentId()}-bg`,
        `${this.getId()}-bg`,
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          props: this.props,
          renderContext: this.renderContext
        })
      )
    );

    return (
      <ContainerBorder
        type="section__item"
        hiddenInResponsive={true}
        activateOnContentClick={false}
      >
        {({ ref: containerBorderRef, attr: containerBorderAttr }) => (
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            <div
              {...containerBorderAttr}
              ref={containerBorderRef}
              className={classNameSectionContent}
            >
              <Roles
                allow={["admin"]}
                fallbackRender={() => this.renderItems(v, vs, vd)}
              >
                {this.renderToolbar()}
                <ToolbarExtend onEscape={this.handleToolbarEscape}>
                  {this.renderItems(v, vs, vd)}
                  {shouldRenderPopup(
                    v,
                    blocksDataSelector(this.getReduxState())
                  ) && this.renderPopups()}
                </ToolbarExtend>
              </Roles>
            </div>
          </CustomCSS>
        )}
      </ContainerBorder>
    );
  }

  renderForView(v, vs, vd) {
    const { className, containerType, customCSS } = v;
    const classNameSectionContent = classnames(
      "brz-section__content",
      `brz-section--${containerType}`,
      className,
      this.css(
        `${this.getComponentId()}-bg`,
        `${this.getId()}-bg`,
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          props: this.props,
          renderContext: this.renderContext
        })
      )
    );

    const config = this.getGlobalConfig();
    const linkData = getLinkData(v, config);

    return (
      <>
        <CustomCSS selectorName={this.getId()} css={customCSS}>
          <div className={classNameSectionContent}>
            {this.renderItems(v, vs, vd)}
            {linkData.href && (
              <Link
                className="brz-link-container"
                type={linkData.type}
                href={linkData.href}
                target={linkData.target}
                rel={linkData.rel}
              />
            )}
          </div>
        </CustomCSS>
        {shouldRenderPopup(v, blocksDataSelector(this.getReduxState())) &&
          this.renderPopups()}
      </>
    );
  }
}

export default SectionItem;
